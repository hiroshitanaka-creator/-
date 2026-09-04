(function registerEffectSystem(H) {
  "use strict";

  const { Util } = H.Core;

  class EffectSystem {
    constructor(game) {
      this.game = game;
    }

    apply(effects, context = {}) {
      const results = [];
      for (const effect of Util.ensureArray(effects)) {
        if (!effect) continue;
        try {
          results.push(this.applyOne(effect, context));
        } catch (error) {
          console.error("Effect failed", effect, error);
          this.game.bus.emit("ui:notify", {
            title: "処理エラー",
            text: `効果「${effect.type || "unknown"}」を適用できませんでした。`,
            icon: "!",
            tone: "danger",
          });
        }
      }
      this.game.markDirty();
      return results;
    }

    applyOne(effect, context = {}) {
      const state = this.game.state;
      const amount = Number(effect.value ?? effect.amount ?? 0);
      switch (effect.type) {
        case "flag":
          state.world.flags[effect.id] = effect.value ?? true;
          return state.world.flags[effect.id];
        case "clearFlag":
          delete state.world.flags[effect.id];
          return true;
        case "evidence":
          return this.game.evidence.discover(effect.id, context);
        case "npcTrust": {
          const npc = state.npcs[effect.id];
          if (!npc) return false;
          const multiplier = amount < 0
            ? H.Data.Config.difficulty[state.settings.difficulty].trustPenalty
            : 1 + Math.max(0, state.player.stats.empathy - 1) * 0.08;
          npc.trust = Util.clamp(Math.round(npc.trust + amount * multiplier), 0, 100);
          this.game.bus.emit("npc:changed", { npcId: effect.id });
          return npc.trust;
        }
        case "npcState": {
          const npc = state.npcs[effect.id];
          if (!npc) return false;
          Util.setByPath(npc, effect.path || "state", effect.value);
          return true;
        }
        case "npcMove": {
          const npc = state.npcs[effect.id];
          if (!npc) return false;
          npc.mapId = effect.mapId ?? npc.mapId;
          npc.x = effect.x ?? npc.x;
          npc.y = effect.y ?? npc.y;
          return true;
        }
        case "world": {
          const path = effect.path || effect.id;
          return this.adjustStateValue(state.world, path, amount, effect.set);
        }
        case "district": {
          const district = state.world.districts[effect.id];
          if (!district) return false;
          const path = effect.path || "fear";
          const result = this.adjustStateValue(district, path, amount, effect.set);
          this.game.world.recalculateWorldMetrics();
          return result;
        }
        case "rumor": {
          const rumor = state.world.rumors[effect.id];
          if (!rumor) return false;
          const path = effect.path || "intensity";
          const result = this.adjustStateValue(rumor, path, amount, effect.set);
          this.game.world.recalculateWorldMetrics();
          return result;
        }
        case "rumorActivate": {
          const rumor = state.world.rumors[effect.id];
          if (!rumor) return false;
          rumor.active = effect.value ?? true;
          if (effect.intensity != null) rumor.intensity = Util.clamp(effect.intensity, 0, 100);
          this.game.bus.emit("rumor:changed", { rumorId: effect.id });
          return true;
        }
        case "item": {
          const next = Math.max(0, (state.player.inventory[effect.id] || 0) + (effect.value ?? 1));
          state.player.inventory[effect.id] = next;
          this.game.bus.emit("inventory:changed", { itemId: effect.id, value: next });
          return next;
        }
        case "currency": {
          const next = Math.max(0, (state.player.currencies[effect.id] || 0) + (effect.value ?? 1));
          state.player.currencies[effect.id] = next;
          return next;
        }
        case "stat": {
          if (!Object.prototype.hasOwnProperty.call(state.player.stats, effect.id)) return false;
          state.player.stats[effect.id] = Util.clamp(
            effect.set ? Number(effect.value) : state.player.stats[effect.id] + amount,
            1,
            6,
          );
          return state.player.stats[effect.id];
        }
        case "xp":
          return this.game.progression.addXP(amount, context.reason || "調査成果");
        case "heal":
          state.player.composure = Util.clamp(state.player.composure + amount, 0, state.player.maxComposure);
          return state.player.composure;
        case "questStart":
          return this.game.quests.start(effect.id);
        case "questComplete":
          return this.game.quests.complete(effect.id);
        case "questFail":
          return this.game.quests.fail(effect.id);
        case "questEvaluate":
          return this.game.quests.evaluateAll();
        case "mapUnlock":
          return this.game.world.unlockMap(effect.id);
        case "advanceTime":
          return this.game.time.advance(Math.max(0, amount || 1), effect.reason || context.reason || "行動");
        case "notify":
          this.game.bus.emit("ui:notify", {
            title: effect.title || "巡察記録",
            text: effect.text || "",
            icon: effect.icon || "◇",
            tone: effect.tone || "normal",
          });
          return true;
        case "story":
          this.game.bus.emit("story:request", { id: effect.id });
          return true;
        case "combat":
          return this.game.combat.start(effect.id || effect.enemyId, context.encounterId || effect.encounterId);
        case "openReport":
          this.game.bus.emit("report:open", {});
          return true;
        case "log":
          this.game.addEvent(effect.text || "記録が更新された。", effect.category || "system");
          return true;
        case "encounterClear": {
          const id = effect.id || context.encounterId;
          if (id && !state.world.clearedEncounters.includes(id)) state.world.clearedEncounters.push(id);
          return true;
        }
        default:
          console.warn("Unknown effect type", effect);
          return false;
      }
    }

    adjustStateValue(target, path, amount, setValue) {
      const current = Number(Util.getByPath(target, path, 0));
      const raw = setValue ? Number(setValue === true ? amount : setValue) : current + amount;
      const boundedPaths = ["fear", "security", "trust", "rumorPressure", "stability", "publicTrust", "globalRumorPressure", "intensity", "credibility"];
      const leaf = String(path).split(".").pop();
      const next = boundedPaths.includes(leaf) ? Util.clamp(Math.round(raw), 0, 100) : raw;
      Util.setByPath(target, path, next);
      return next;
    }
  }

  H.Systems.EffectSystem = EffectSystem;
})(window.Haimachi);
