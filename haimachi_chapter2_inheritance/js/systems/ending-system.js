(function registerEndingSystem(H) {
  "use strict";

  class EndingSystem {
    constructor(game) {
      this.game = game;
    }

    readiness() {
      const state = this.game.state;
      const key = [
        "d2_black_rain_changes_records",
        "d2_names_erased_for_collateral",
        "d2_ledger_loop",
        "d2_bell_foundry_amplifies_revision",
        "d2_council_authorized_shadow_map",
        "d2_complete_second_case",
      ];
      return {
        unlocked: Boolean(state.world.flags.report_unlocked),
        miraRescued: Boolean(state.world.flags.mira_rescued),
        witnessProtection: Boolean(state.world.flags.witness_protection_ready),
        nameAnchor: Boolean(state.world.flags.name_anchor_ready),
        bellSilenced: Boolean(state.world.flags.black_bell_silenced),
        solvedKey: key.filter((id) => state.deductions.solved.includes(id)).length,
        requiredKey: key.length,
        evidenceCount: state.evidence.discovered.length,
        stability: state.world.stability,
        publicTrust: state.world.publicTrust,
      };
    }

    submit(report) {
      const state = this.game.state;
      if (!report?.cause || !report?.responsible || !report?.policy) {
        return { success: false, error: "原因・責任主体・公開方針をすべて選択してください。" };
      }
      if (!state.world.flags.report_unlocked) {
        return { success: false, error: "第二章の全体像が推理盤で成立していません。" };
      }
      const endingId = this.chooseEnding(report);
      const ending = H.Data.EndingById[endingId] || H.Data.Endings[0];
      state.world.report = {
        ...report,
        submittedAt: { day: state.world.day, segment: state.world.segment },
        readiness: this.readiness(),
      };
      state.world.endingId = ending.id;
      state.world.flags.chapter_complete = true;
      state.world.flags.postgame = false;
      state.mode = "ending";
      state.paused = true;
      this.game.addEvent(`正式報告を提出した。結末「${ending.title}」`, "ending");
      this.game.quests.evaluateAll();
      this.game.saveManager.save(state, "manual", "chapter complete");
      this.game.bus.emit("ending:show", { ending, report: state.world.report, readiness: this.readiness() });
      return { success: true, endingId: ending.id, ending };
    }

    chooseEnding(report) {
      const state = this.game.state;
      const solved = new Set(state.deductions.solved);
      const complete = solved.has("d2_complete_second_case");
      const council = solved.has("d2_council_authorized_shadow_map");
      const bell = Boolean(state.world.flags.black_bell_silenced);
      const rescue = Boolean(state.world.flags.mira_rescued);
      const anchor = Boolean(state.world.flags.name_anchor_ready);
      const protection = Boolean(state.world.flags.witness_protection_ready);
      const safeCity = state.world.stability >= 34 && state.world.globalRumorPressure < 78;

      if (report.cause === "natural_rain") return "ending2_false_rain";
      if (report.responsible === "sabra" && !council) return "ending2_scape_ledger";
      if (report.policy === "bargain") return "ending2_budget_bargain";
      if (report.policy === "sealed") return "ending2_silent_bonds";
      if (!complete || !rescue) return "ending2_partial_audit";
      if (report.policy === "immediate" && (!anchor || !protection || !safeCity)) return "ending2_unanchored_truth";
      if (report.cause !== "debt_map_loop") return "ending2_ordered_audit";
      if (!["council_ring", "shared_network"].includes(report.responsible)) return "ending2_ordered_audit";
      if ((report.policy === "staged" || report.policy === "audit_decoy") && anchor && protection && bell && safeCity) return "ending2_true_revision";
      return "ending2_ordered_audit";
    }

    enterPostgame() {
      const state = this.game.state;
      state.world.flags.postgame = true;
      state.mode = "exploration";
      state.paused = false;
      this.game.bus.emit("ending:close", {});
      const start = H.Data.Config.startMap || "map_archive";
      const spawn = H.Data.Maps[start]?.spawn || H.Data.Config.startPosition || { x: 760, y: 700 };
      this.game.world.enterMap(start, spawn.x, spawn.y, { force: true });
      return true;
    }
  }

  H.Systems.EndingSystem = EndingSystem;
})(window.Haimachi);
