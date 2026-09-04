(function registerInteractionSystem(H) {
  "use strict";

  const { Util, ConditionEvaluator } = H.Core;

  class InteractionSystem {
    constructor(game) {
      this.game = game;
      this.conditions = new ConditionEvaluator();
      this.items = [];
      this.nearest = null;
    }

    refresh() {
      this.items = this.buildItems();
      this.nearest = null;
    }

    buildItems() {
      const state = this.game.state;
      const map = this.game.world.currentMap;
      if (!map) return [];
      const items = [];

      for (const npcData of H.Data.NPCs || []) {
        const npcState = state.npcs[npcData.id];
        if (!npcState || npcState.mapId !== map.id || npcState.state === "hidden") continue;
        items.push({
          type: "npc",
          id: npcData.id,
          x: npcState.x,
          y: npcState.y,
          radius: 52,
          prompt: `${npcData.shortName || npcData.name}と話す`,
          data: npcData,
        });
      }

      for (const exit of map.exits || []) {
        const available = this.conditions.test(exit.condition, state, { mapId: map.id });
        items.push({ ...exit, type: "exit", available, prompt: available ? exit.prompt : (exit.lockedText || "道は閉じている"), data: exit });
      }

      for (const hotspot of map.hotspots || []) {
        const available = this.conditions.test(hotspot.condition, state, { mapId: map.id });
        if (!available && hotspot.hiddenUntilAvailable) continue;
        items.push({ ...hotspot, type: "hotspot", available, prompt: available ? hotspot.prompt : (hotspot.lockedText || "今は調べられない"), data: hotspot });
      }

      for (const encounter of map.encounters || []) {
        const available = this.conditions.test(encounter.condition, state, { mapId: map.id });
        if (!available) continue;
        items.push({ ...encounter, type: "encounter", available: true, data: encounter });
      }
      return items;
    }

    update() {
      if (this.game.state.mode !== "exploration" || this.game.state.paused || this.game.ui?.isModalOpen()) {
        if (this.nearest) {
          this.nearest = null;
          this.game.bus.emit("interaction:changed", { item: null });
        }
        return;
      }
      this.items = this.buildItems();
      const player = this.game.state.player;
      let best = null;
      let bestDistance = Infinity;
      for (const item of this.items) {
        const range = item.radius || H.Data.Config.interactionRange;
        const distance = Util.distanceXY(player.x, player.y, item.x, item.y);
        if (distance <= range + H.Data.Config.interactionRange * 0.38 && distance < bestDistance) {
          best = item;
          bestDistance = distance;
        }
      }
      if ((best?.type !== this.nearest?.type) || (best?.id !== this.nearest?.id)) {
        this.nearest = best;
        this.game.bus.emit("interaction:changed", { item: best });
      }
    }

    interact() {
      const item = this.nearest;
      if (!item || this.game.state.mode !== "exploration") return false;
      if (item.available === false) {
        this.game.bus.emit("ui:notify", { title: "まだ開かない線", text: item.prompt, icon: "鍵", tone: "warning" });
        return false;
      }
      switch (item.type) {
        case "npc": return this.game.dialogue.open(item.id);
        case "exit": return this.game.world.enterMap(item.targetMap, item.targetX, item.targetY);
        case "hotspot": return this.openInvestigation(item.data);
        case "encounter": return this.game.combat.start(item.enemyId, item.id);
        default: return false;
      }
    }

    openInvestigation(hotspot) {
      const actions = (hotspot.actions || []).filter((action) => {
        const key = `${hotspot.id}:${action.id}`;
        const alreadyUsed = Boolean(this.game.state.world.usedHotspots[key]);
        if (alreadyUsed && !action.repeatable) return false;
        return this.conditions.test(action.condition || action.requires, this.game.state, { hotspotId: hotspot.id, actionId: action.id });
      });
      this.game.state.investigation = { hotspotId: hotspot.id, title: hotspot.title, actions: actions.map((action) => action.id) };
      this.game.state.paused = true;
      this.game.bus.emit("investigation:open", { hotspot, actions });
      return true;
    }

    performInvestigation(hotspotId, actionId) {
      const map = this.game.world.currentMap;
      const hotspot = (map.hotspots || []).find((entry) => entry.id === hotspotId);
      const action = hotspot?.actions?.find((entry) => entry.id === actionId);
      if (!hotspot || !action) return { success: false, text: "調査対象を確認できない。" };
      const key = `${hotspot.id}:${action.id}`;
      if (this.game.state.world.usedHotspots[key] && !action.repeatable) return { success: false, text: "この調査はすでに完了している。" };
      if (!this.conditions.test(action.condition || action.requires, this.game.state, { hotspotId, actionId })) {
        return { success: false, text: action.lockedText || "必要な証拠または条件が足りない。" };
      }

      let success = true;
      let checkText = "";
      if (action.stat) {
        const stat = this.game.state.player.stats[action.stat] || 0;
        const assist = H.Data.Config.difficulty[this.game.state.settings.difficulty].investigationAssist || 0;
        const effective = stat + assist;
        success = effective >= (action.threshold || 1);
        checkText = `${this.statName(action.stat)} ${stat}${assist ? `（難易度補正 ${assist > 0 ? "+" : ""}${assist}）` : ""} / 必要 ${action.threshold || 1}`;
      }

      if (success) {
        if (!action.repeatable) this.game.state.world.usedHotspots[key] = { day: this.game.state.world.day, segment: this.game.state.world.segment };
        this.game.effects.apply(action.effects, { hotspotId, actionId, reason: hotspot.title });
      } else {
        this.game.effects.apply(action.failEffects, { hotspotId, actionId, reason: `${hotspot.title}・失敗` });
      }
      if (action.timeCost) this.game.time.advance(action.timeCost, hotspot.title);
      const text = success ? action.successText : action.failText;
      this.game.addEvent(`${hotspot.title}：${text}`, success ? "investigation" : "setback");
      this.game.quests.evaluateAll();
      this.game.bus.emit("investigation:result", { hotspot, action, success, text, checkText });
      this.game.saveManager.scheduleAutoSave(this.game.state);
      return { success, text, checkText };
    }

    closeInvestigation() {
      this.game.state.investigation = null;
      this.game.state.paused = false;
      this.game.bus.emit("investigation:close", {});
    }

    statName(id) {
      return H.Data.Config.progression.levelRewards[id]?.title || id;
    }
  }

  H.Systems.InteractionSystem = InteractionSystem;
})(window.Haimachi);
