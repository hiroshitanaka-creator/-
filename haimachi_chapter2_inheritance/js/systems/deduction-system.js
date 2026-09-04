(function registerDeductionSystem(H) {
  "use strict";

  const { ConditionEvaluator, Util } = H.Core;

  class DeductionSystem {
    constructor(game) {
      this.game = game;
      this.conditions = new ConditionEvaluator();
    }

    available() {
      const state = this.game.state;
      return (H.Data.Deductions || []).filter((deduction) => {
        if (state.deductions.solved.includes(deduction.id)) return true;
        if (!this.conditions.test(deduction.availability, state, { deductionId: deduction.id })) return false;
        return (deduction.requiredDeductions || []).every((id) => state.deductions.solved.includes(id));
      });
    }

    selectClaim(id) {
      const deduction = H.Data.DeductionById[id];
      if (!deduction || !this.available().some((entry) => entry.id === id)) return false;
      this.game.state.deductions.selectedClaim = id;
      this.game.state.deductions.selectedEvidence = [];
      this.game.bus.emit("deduction:selection", this.getBoardState());
      return true;
    }

    toggleEvidence(id) {
      const state = this.game.state;
      const claim = H.Data.DeductionById[state.deductions.selectedClaim];
      if (!claim || !state.evidence.discovered.includes(id) || state.deductions.solved.includes(claim.id)) return false;
      const selected = state.deductions.selectedEvidence;
      if (selected.includes(id)) Util.removeFromArray(selected, id);
      else if (selected.length < claim.slots) selected.push(id);
      else {
        selected.shift();
        selected.push(id);
      }
      this.game.bus.emit("deduction:selection", this.getBoardState());
      return true;
    }

    validate(id = this.game.state.deductions.selectedClaim) {
      const state = this.game.state;
      const deduction = H.Data.DeductionById[id];
      if (!deduction || state.deductions.solved.includes(id)) return { success: false, reason: "invalid" };
      const selected = state.deductions.selectedEvidence.slice();
      const groupsMatched = deduction.groups.map((group) => selected.find((evidenceId) => group.includes(evidenceId)) || null);
      const success = selected.length === deduction.slots && groupsMatched.every(Boolean) && new Set(groupsMatched).size === groupsMatched.length;
      state.deductions.attempts[id] = (state.deductions.attempts[id] || 0) + 1;

      if (success) {
        state.deductions.solved.push(id);
        state.deductions.log.push({ id, selected, day: state.world.day, segment: state.world.segment, success: true });
        this.game.effects.apply([
          { type: "xp", value: deduction.rewards?.xp || 0 },
          { type: "currency", id: "truthTokens", value: deduction.rewards?.truthTokens || 0 },
          ...(deduction.effects || []),
        ], { deductionId: id, reason: `推理成立：${deduction.shortTitle}` });
        this.game.audio.deduction();
        this.game.addEvent(`推理成立「${deduction.title}」`, "deduction");
        this.game.bus.emit("deduction:solved", { deduction, selected, result: deduction.result });
        this.game.bus.emit("ui:notify", {
          title: "推理が成立",
          text: `${deduction.shortTitle} — ${deduction.shortResult}`,
          icon: "理",
          tone: "success",
        });
        state.deductions.selectedEvidence = [];
        this.game.quests.evaluateAll();
        this.game.saveManager.scheduleAutoSave(state);
        return { success: true, deduction, selected, result: deduction.result };
      }

      state.deductions.log.push({ id, selected, day: state.world.day, segment: state.world.segment, success: false });
      const attempts = state.deductions.attempts[id];
      const hintIndex = Math.min(attempts - 1, (deduction.failureHints || []).length - 1);
      const hint = deduction.failureHints?.[hintIndex] || "三つの証拠が、それぞれ別の論理役割を果たす組み合わせを探す。";
      if (state.settings.difficulty !== "story") {
        state.world.globalRumorPressure = Util.clamp(state.world.globalRumorPressure + 1, 0, 100);
      }
      this.game.audio.failure();
      this.game.bus.emit("deduction:failed", { deduction, selected, hint, groupsMatched });
      return { success: false, deduction, selected, hint, groupsMatched };
    }

    getBoardState() {
      const state = this.game.state;
      const claim = H.Data.DeductionById[state.deductions.selectedClaim] || null;
      return {
        claim,
        selectedEvidence: state.deductions.selectedEvidence.slice(),
        available: this.available(),
        discoveredEvidence: this.game.evidence.discovered(),
      };
    }
  }

  H.Systems.DeductionSystem = DeductionSystem;
})(window.Haimachi);
