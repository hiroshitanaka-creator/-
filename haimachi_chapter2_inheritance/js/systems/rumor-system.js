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
        let growth = 1.05 * modifier;
        growth += this.specialGrowthDelta(id, state);
        growth += rng.float(-0.45, 0.65);
        growth -= Math.min(1.35, solved * 0.14 + knownCounterEvidence * 0.014);
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

    specialGrowthDelta(id, state) {
      const ch1TruthAnchor = state.world.flags.ch1_truth_anchor ? -0.35 : 0;
      const ch1FalseBeast = state.world.flags.ch1_false_beast_record ? 0.75 : 0;
      const ch1Unshielded = state.world.flags.ch1_truth_without_shield ? 0.42 : 0;
      const ch1Sealed = state.world.flags.ch1_record_sealed ? 0.28 : 0;
      const factions = state.world.factions || {};
      const rumorBrokerPush = ((factions.rumor_brokers?.influence || 40) - (factions.rumor_brokers?.attitude || 0) * 0.35) / 120 - 0.25;
      const ledgerCartelPush = ((factions.ledger_cartel?.influence || 40) + (factions.ledger_cartel?.pressure || 40) - 80) / 160;
      const citizenShield = Math.max(0, (factions.citizen_network?.attitude || 0) + ((factions.citizen_network?.influence || 40) - 40) * 0.35) / 80;
      const auditSeal = Math.max(0, (factions.audit_bureau?.pressure || 40) - 45) / 90;
      const bellPressure = Math.max(0, (factions.bell_guild?.pressure || 40) - 42) / 95;
      switch (id) {
        case "r_black_rain":
          return (state.world.flags.black_bell_silenced ? -1.2 : 0.75)
            + (state.deductions.solved.includes("d2_black_rain_changes_records") ? -0.55 : 0)
            + (state.world.clearedEncounters.includes("enc_black_rain_crowd") ? -0.65 : 0)
            + ch1TruthAnchor + ch1FalseBeast + ch1Unshielded + ch1Sealed
            + rumorBrokerPush * 0.45 + auditSeal * 0.25 - citizenShield * 0.35;
        case "r_eld_lied":
          return (state.evidence.discovered.includes("t_eld_second_route") ? -0.85 : 0.3)
            + (state.world.flags.ch1_witnesses_unshielded ? 0.45 : 0)
            + (state.world.flags.ch1_sealed_policy ? 0.35 : 0)
            + (state.world.flags.ch1_bargain_policy ? 0.4 : 0)
            + (state.world.flags.ch1_truth_anchor ? -0.25 : 0)
            + rumorBrokerPush * 0.55 - citizenShield * 0.45;
        case "r_name_debt":
          return (state.world.flags.name_anchor_ready ? -1.15 : 0.45) + ledgerCartelPush * 0.65 - citizenShield * 0.25;
        case "r_black_bell":
          return (state.world.flags.black_bell_silenced ? -1.55 : 0.65) + bellPressure * 0.55 + auditSeal * 0.15;
        case "r_double_gate":
          return (state.deductions.solved.includes("d2_double_map_splits_jurisdiction") ? -0.8 : 0.35) + ledgerCartelPush * 0.25 + auditSeal * 0.25;
        default:
          return 0;
      }
    }

    applyThresholdEvents() {
      const state = this.game.state;
      const districts = Object.entries(state.world.districts);
      const highest = districts.reduce((best, entry) => {
        if (!best) return entry;
        return entry[1].rumorPressure > best[1].rumorPressure ? entry : best;
      }, null);
      if (!highest) return;
      const [districtId, district] = highest;
      const config = H.Data.Config.districts.find((entry) => entry.id === districtId);
      const name = config?.name || districtId;
      const lockFlag = `soft_lockdown_${districtId}`;
      if (district.rumorPressure >= 82 && !state.world.flags[lockFlag]) {
        state.world.flags[lockFlag] = true;
        this.game.bus.emit("ui:notify", {
          title: `${name}・黒雨封鎖線`,
          text: "噂圧が閾値を超えた。通行は可能だが、住民は記録官にも証言を控え始めている。",
          icon: "封",
          tone: "danger",
        });
      }
      if (district.rumorPressure < 62 && state.world.flags[lockFlag]) {
        state.world.flags[lockFlag] = false;
        this.game.bus.emit("ui:notify", {
          title: `${name}の封鎖線が薄れる`,
          text: "噂の強度が下がり、窓口と路地に人の流れが戻り始めた。",
          icon: "路",
          tone: "success",
        });
      }
      if (state.world.stability <= 25 && !state.world.flags.stability_critical) {
        state.world.flags.stability_critical = true;
        this.game.bus.emit("ui:notify", {
          title: "街の安定が危険域",
          text: "黒雨、名簿欠落、公債不安が連鎖している。調査だけでなく、証人保護と黒鐘停止が必要だ。",
          icon: "!",
          tone: "danger",
        });
      }
    }
  }

  H.Systems.RumorSystem = RumorSystem;
})(window.Haimachi);
