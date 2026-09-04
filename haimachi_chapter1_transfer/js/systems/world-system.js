(function registerWorldSystem(H) {
  "use strict";

  const { Util } = H.Core;

  class WorldSystem {
    constructor(game) {
      this.game = game;
      this.lastMapId = null;
    }

    get currentMap() {
      return H.Data.Maps[this.game.state.player.mapId] || H.Data.Maps[H.Data.Config.startMap];
    }

    unlockMap(mapId) {
      const state = this.game.state;
      if (!H.Data.Maps[mapId]) return false;
      if (!state.world.unlockedMaps.includes(mapId)) {
        state.world.unlockedMaps.push(mapId);
        this.game.bus.emit("ui:notify", {
          title: "地図に通行線を追加",
          text: `${H.Data.Maps[mapId].name}へ移動できるようになった。`,
          icon: "図",
          tone: "success",
        });
      }
      return true;
    }

    enterMap(mapId, x = null, y = null, options = {}) {
      const state = this.game.state;
      const map = H.Data.Maps[mapId];
      if (!map) return false;
      if (!state.world.unlockedMaps.includes(mapId) && !options.force) {
        this.game.bus.emit("ui:notify", { title: "地図にない道", text: "この場所へ続く正式な通行線は、まだ復元されていない。", icon: "×", tone: "warning" });
        return false;
      }

      const previous = state.player.mapId;
      state.player.mapId = mapId;
      state.player.x = x ?? map.spawn.x;
      state.player.y = y ?? map.spawn.y;
      state.player.moving = false;
      state.world.locationHistory.push({ from: previous, to: mapId, day: state.world.day, segment: state.world.segment });
      if (state.world.locationHistory.length > 120) state.world.locationHistory.shift();
      const district = state.world.districts[map.district];
      if (district) district.visited = true;
      if (!["old_waterworks"].includes(mapId)) {
        state.player.lastSafeMap = mapId;
        state.player.lastSafePosition = { x: state.player.x, y: state.player.y };
      }
      this.lastMapId = previous;
      this.game.interactions.refresh();
      this.game.renderer?.snapCamera();
      this.game.bus.emit("world:mapChanged", { mapId, previousMapId: previous, map });
      this.game.audio.setAmbience(map.ambient);
      this.game.addEvent(`${map.name}へ移動した。`, "travel");

      if (mapId === "old_waterworks" && !state.world.flags.entered_waterworks) {
        state.world.flags.entered_waterworks = true;
        this.game.bus.emit("story:request", { id: "waterworks_entry" });
        this.game.quests.evaluateAll();
      }
      this.game.saveManager.scheduleAutoSave(state);
      return true;
    }

    recalculateWorldMetrics() {
      const state = this.game.state;
      const districts = Object.values(state.world.districts);
      if (!districts.length) return;
      const averageFear = districts.reduce((sum, d) => sum + d.fear, 0) / districts.length;
      const averageSecurity = districts.reduce((sum, d) => sum + d.security, 0) / districts.length;
      const averageRumor = districts.reduce((sum, d) => sum + d.rumorPressure, 0) / districts.length;
      const activeRumors = Object.values(state.world.rumors).filter((r) => r.active);
      const rumorMean = activeRumors.length
        ? activeRumors.reduce((sum, r) => sum + r.intensity * (0.45 + r.credibility / 180), 0) / activeRumors.length
        : 0;
      state.world.globalRumorPressure = Util.clamp(Math.round(averageRumor * 0.55 + rumorMean * 0.45), 0, 100);
      const calculated = 100 - averageFear * 0.52 + averageSecurity * 0.23 - state.world.globalRumorPressure * 0.18;
      state.world.stability = Util.clamp(Math.round(calculated), 0, 100);
      return state.world.stability;
    }

    getMapStateSummary(mapId = this.game.state.player.mapId) {
      const map = H.Data.Maps[mapId];
      const district = this.game.state.world.districts[map?.district];
      return { map, district };
    }

    fastTravel(mapId) {
      if (this.game.state.mode !== "exploration" || this.game.state.combat || this.game.state.dialogue || this.game.state.investigation) return false;
      const map = H.Data.Maps[mapId];
      if (!map || !this.game.state.world.unlockedMaps.includes(mapId)) return false;
      this.game.time.advance(1, "地図による移動");
      return this.enterMap(mapId, map.spawn.x, map.spawn.y);
    }
  }

  H.Systems.WorldSystem = WorldSystem;
})(window.Haimachi);
