(function registerDeductionBoard(H) {
  "use strict";

  const { Util } = H.Core;

  class DeductionBoard {
    constructor(game) {
      this.game = game;
      this.lastResult = null;
    }

    mount(root) {
      const available = this.game.deductions.available();
      const state = this.game.state;
      let selectedId = state.deductions.selectedClaim;
      if (!selectedId || !available.some((item) => item.id === selectedId)) {
        selectedId = available.find((item) => !state.deductions.solved.includes(item.id))?.id || available[0]?.id || null;
        if (selectedId) this.game.deductions.selectClaim(selectedId);
      }
      const claim = selectedId ? H.Data.DeductionById[selectedId] : null;
      root.innerHTML = this.template(available, claim);
      this.bind(root);
    }

    template(available, claim) {
      const state = this.game.state;
      const availableIds = new Set(available.map((entry) => entry.id));
      const claimButtons = H.Data.Deductions.map((entry) => {
        const solved = state.deductions.solved.includes(entry.id);
        const unlocked = availableIds.has(entry.id);
        return `<button class="claim-button ${claim?.id === entry.id ? "is-active" : ""} ${solved ? "is-solved" : ""}" data-claim-id="${entry.id}" ${unlocked ? "" : "disabled"}><b>${solved ? "✓ " : unlocked ? "◇ " : "錠 "}${Util.escapeHTML(entry.shortTitle)}</b><small>${solved ? "推理成立" : unlocked ? `${entry.slots}件の証拠で検証` : "前提証拠または推理が必要"}</small></button>`;
      }).join("");
      if (!claim) return `<div class="deduction-layout"><div class="claim-list">${claimButtons}</div><div class="empty-state">証拠を集めると検証可能な仮説が現れます。</div></div>`;

      const solved = state.deductions.solved.includes(claim.id);
      const solvedRecord = solved
        ? [...state.deductions.log].reverse().find((entry) => entry.id === claim.id && entry.success)
        : null;
      const selected = solvedRecord?.selected || state.deductions.selectedEvidence;
      const slots = Array.from({ length: claim.slots }, (_, index) => {
        const evidence = H.Data.EvidenceById[selected[index]];
        return `<button class="deduction-slot ${evidence ? "has-card" : ""}" data-slot-index="${index}" ${solved ? "disabled" : ""}>${evidence ? `<span class="evidence-icon">${evidence.icon}</span><b>${Util.escapeHTML(evidence.title)}</b><small>${Util.escapeHTML(evidence.tags.slice(0,3).join("・"))}</small>` : `<b>証拠枠 ${index + 1}</b><small>下の証拠を選択</small>`}</button>`;
      }).join("");
      const pool = this.game.evidence.discovered().map((evidence) => `<button class="pool-card ${selected.includes(evidence.id) ? "is-selected" : ""}" data-board-evidence="${evidence.id}" ${solved ? "disabled" : ""}><b>${evidence.icon} ${Util.escapeHTML(evidence.title)}</b><small>${Util.escapeHTML(evidence.tags.slice(0,4).join("・"))}</small></button>`).join("");
      let result = "異なる角度の証拠を三つ選び、仮説を検証してください。証拠数だけではなく、各証拠の論理的役割が判定されます。";
      let resultClass = "";
      if (solved) { result = claim.result; resultClass = "is-success"; }
      else if (this.lastResult?.deduction?.id === claim.id) {
        result = this.lastResult.success ? this.lastResult.result : (state.settings.showHints ? `推理は成立しない。\nヒント：${this.lastResult.hint}` : "推理は成立しない。選んだ証拠の役割を見直してください。");
        resultClass = this.lastResult.success ? "is-success" : "";
      }
      return `<div class="deduction-layout">
        <div class="claim-list">${claimButtons}</div>
        <section class="claim-stage">
          <div class="claim-copy"><p class="eyebrow">検証する仮説</p><h3>${Util.escapeHTML(claim.title)}</h3><p>${Util.escapeHTML(claim.question)}</p></div>
          <div class="deduction-slots">${slots}</div>
          <div class="deduction-actions"><button class="button button-primary" data-validate-deduction ${solved || selected.length !== claim.slots ? "disabled" : ""}>この関係を検証する</button><button class="button button-ghost" data-clear-deduction ${solved || !selected.length ? "disabled" : ""}>選択を外す</button></div>
          <div class="deduction-result ${resultClass}">${Util.escapeHTML(result)}</div>
          <div class="deduction-evidence-pool"><div class="section-heading"><h3>使用できる証拠</h3><p>${state.evidence.discovered.length}件</p></div><div class="pool-grid">${pool || `<div class="empty-state">まだ証拠がありません。</div>`}</div></div>
        </section>
      </div>`;
    }

    bind(root) {
      root.querySelectorAll("[data-claim-id]").forEach((button) => button.addEventListener("click", () => {
        this.lastResult = null;
        this.game.deductions.selectClaim(button.dataset.claimId);
        this.mount(root);
      }));
      root.querySelectorAll("[data-board-evidence]").forEach((button) => button.addEventListener("click", () => {
        this.lastResult = null;
        this.game.deductions.toggleEvidence(button.dataset.boardEvidence);
        this.mount(root);
      }));
      root.querySelectorAll("[data-slot-index]").forEach((button) => button.addEventListener("click", () => {
        const id = this.game.state.deductions.selectedEvidence[Number(button.dataset.slotIndex)];
        if (id) this.game.deductions.toggleEvidence(id);
        this.mount(root);
      }));
      root.querySelector("[data-clear-deduction]")?.addEventListener("click", () => {
        this.game.state.deductions.selectedEvidence = [];
        this.lastResult = null;
        this.mount(root);
      });
      root.querySelector("[data-validate-deduction]")?.addEventListener("click", () => {
        this.lastResult = this.game.deductions.validate();
        this.mount(root);
      });
    }
  }

  H.UI.DeductionBoard = DeductionBoard;
})(window.Haimachi);
