(function registerRumorSystem(H) {
  "use strict";

  const { Util, SeededRNG } = H.Core;

  class RumorSystem {
    constructor(game) {
      this.game = game;
    }

    advanceTick(reason = "時間経過") {
      const state = this.game.state;
      if (state.world.flags.chapter_complete && state.world.flags.postgame) return;
      const modifier = H.Data.Config.difficulty[state.settings.difficulty].rumorGrowth;
      const rng = new SeededRNG(state.rng?.seed || "gray-city");
      rng.restore(state.rng);
      const knownCounterEvidence = state.evidence.discovered.length;
      const solved = state.deductions.solved.length;

      for (const [id, rumor] of Object.entries(state.world.rumors)) {
        if (!rumor.active || rumor.countered) continue;
        let growth = 1.1 * modifier;
        if (id === "r_gray_beast") {
          growth += state.world.flags.rain_bell_repaired ? -1.3 : 1.4;
          growth += state.world.flags.poster_network_exposed ? -0.9 : 0.6;
          growth += state.world.clearedEncounters.includes("enc_north_false_hound") ? -0.8 : 0;
        }
        growth += rng.float(-0.45, 0.65);
        growth -= Math.min(1.1, solved * 0.12 + knownCounterEvidence * 0.012);
        rumor.intensity = Util.clamp(Math.round((rumor.intensity + growth) * 10) / 10, 0, 100);
        if (rumor.intensity <= 3) rumor.countered = true;
      }
      state.rng = rng.snapshot();

      for (const [districtId, district] of Object.entries(state.world.districts)) {
        const related = Object.entries(state.world.rumors)
          .filter(([rumorId, rumor]) => rumor.active && !rumor.countered && H.Data.Config.initialRumors.find((item) => item.id === rumorId)?.district === districtId)
          .map(([, rumor]) => rumor);
        const pressure = related.length
          ? related.reduce((sum, rumor) => sum + rumor.intensity * (0.6 + rumor.credibility / 250), 0) / related.length
          : district.rumorPressure * 0.96;
        district.rumorPressure = Util.clamp(Math.round(district.rumorPressure * 0.72 + pressure * 0.28), 0, 100);
        const fearDelta = (district.rumorPressure - district.security) / 70 * modifier;
        district.fear = Util.clamp(Math.round((district.fear + fearDelta) * 10) / 10, 0, 100);
        district.trust = Util.clamp(Math.round((district.trust - Math.max(0, fearDelta) * 0.12) * 10) / 10, 0, 100);
      }

      this.game.world.recalculateWorldMetrics();
      this.applyThresholdEvents(reason);
      this.game.bus.emit("rumor:tick", { reason });
    }

    applyThresholdEvents() {
      const state = this.game.state;
      const north = state.world.districts.north;
      if (north.rumorPressure >= 82 && !state.world.flags.north_soft_lockdown) {
        state.world.flags.north_soft_lockdown = true;
        this.game.bus.emit("ui:notify", {
          title: "北区・夜間封鎖",
          text: "灰獣噂が閾値を超えた。通行は可能だが、住民は巡察官にも警戒している。",
          icon: "封",
          tone: "danger",
        });
      }
      if (north.rumorPressure < 62 && state.world.flags.north_soft_lockdown) {
        state.world.flags.north_soft_lockdown = false;
        this.game.bus.emit("ui:notify", {
          title: "北区の封鎖が緩む",
          text: "噂の信用が低下し、住民が細い路地を再び使い始めた。",
          icon: "路",
          tone: "success",
        });
      }
      if (state.world.stability <= 25 && !state.world.flags.stability_critical) {
        state.world.flags.stability_critical = true;
        this.game.bus.emit("ui:notify", {
          title: "街の安定が危険域",
          text: "恐怖と封鎖が連鎖している。追加調査だけでなく、鐘の修理や群衆の鎮静も必要だ。",
          icon: "!",
          tone: "danger",
        });
      }
    }
  }

  H.Systems.RumorSystem = RumorSystem;
})(window.Haimachi);
