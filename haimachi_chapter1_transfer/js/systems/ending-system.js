(function registerEndingSystem(H) {
  "use strict";

  class EndingSystem {
    constructor(game) {
      this.game = game;
    }

    readiness() {
      const state = this.game.state;
      const key = [
        "d_watch_detained_eld",
        "d_eld_in_waterworks",
        "d_dario_ordered_coverup",
        "d_gray_salt_mechanism",
        "d_complete_case",
      ];
      return {
        unlocked: Boolean(state.world.flags.report_unlocked),
        eldRescued: Boolean(state.world.flags.eld_rescued),
        witnessProtection: Boolean(state.world.flags.witness_protection_ready),
        bellRepaired: Boolean(state.world.flags.rain_bell_repaired),
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
        return { success: false, error: "事件の全体像が推理盤で成立していません。" };
      }
      const endingId = this.chooseEnding(report);
      const ending = H.Data.EndingById[endingId];
      state.world.report = {
        ...report,
        submittedAt: { day: state.world.day, segment: state.world.segment },
        readiness: this.readiness(),
      };
      state.world.endingId = endingId;
      state.world.flags.chapter_complete = true;
      state.world.flags.postgame = false;
      state.mode = "ending";
      state.paused = true;
      this.game.addEvent(`正式報告を提出した。結末「${ending.title}」`, "ending");
      this.game.quests.evaluateAll();
      this.game.saveManager.save(state, "manual", "chapter complete");
      this.game.transfer?.persist(state);
      this.game.bus.emit("ending:show", { ending, report: state.world.report, readiness: this.readiness() });
      return { success: true, endingId, ending };
    }

    chooseEnding(report) {
      const state = this.game.state;
      const solved = new Set(state.deductions.solved);
      const complete = solved.has("d_complete_case");
      const mechanism = solved.has("d_gray_salt_mechanism");
      const command = solved.has("d_dario_ordered_coverup");
      const rescue = Boolean(state.world.flags.eld_rescued);
      const protection = Boolean(state.world.flags.witness_protection_ready);
      const bell = Boolean(state.world.flags.rain_bell_repaired);
      const safeCity = state.world.stability >= 42 && state.world.districts.north.fear < 72;

      if (report.cause === "beast") return "ending_false_beast";
      if (report.responsible === "ines") return "ending_ines_scapegoat";
      if (report.policy === "bargain") return "ending_bargain";
      if (!complete || !mechanism || !command || !rescue) return "ending_partial_case";
      if (report.policy === "sealed") return "ending_sealed_order";
      if (report.policy === "immediate" && (!protection || !safeCity)) return "ending_unshielded_truth";
      if (
        report.cause === "compound" &&
        ["dario", "shared"].includes(report.responsible) &&
        report.policy === "staged" &&
        protection && bell && safeCity
      ) return "ending_true_map";
      return "ending_ordered_truth";
    }

    enterPostgame() {
      const state = this.game.state;
      state.world.flags.postgame = true;
      state.mode = "exploration";
      state.paused = false;
      this.game.bus.emit("ending:close", {});
      this.game.world.enterMap("map_archive", 750, 650, { force: true });
      return true;
    }
  }

  H.Systems.EndingSystem = EndingSystem;
})(window.Haimachi);
