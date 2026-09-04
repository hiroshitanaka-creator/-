(function registerReportPanel(H) {
  "use strict";

  const { DOM } = H.UI;
  const { Util } = H.Core;

  class ReportPanel {
    constructor(game) {
      this.game = game;
      this.overlay = DOM.id("reportOverlay");
      DOM.id("reportCloseButton")?.addEventListener("click", () => this.close());
      DOM.id("submitReportButton")?.addEventListener("click", () => this.submit());
    }

    open() {
      this.render();
      this.game.state.paused = true;
      DOM.show(this.overlay);
    }

    render() {
      const readiness = this.game.endings.readiness();
      DOM.setHTML(DOM.id("reportReadiness"), `
        ${this.pill("エルド救助", readiness.eldRescued)}
        ${this.pill("証人保護", readiness.witnessProtection)}
        ${this.pill("雨鐘修復", readiness.bellRepaired)}
        <span class="status-pill ${readiness.solvedKey === readiness.requiredKey ? "status-positive" : "status-warning"}">主要推理 ${readiness.solvedKey}/${readiness.requiredKey}</span>
        <span class="status-pill ${readiness.stability >= 42 ? "status-positive" : "status-danger"}">街の安定 ${Math.round(readiness.stability)}</span>
      `);
      this.renderOptions("reportCauseChoices", "cause", H.Data.Config.reportOptions.cause);
      this.renderOptions("reportResponsibleChoices", "responsible", H.Data.Config.reportOptions.responsible);
      this.renderOptions("reportPolicyChoices", "policy", H.Data.Config.reportOptions.policy);
      const prior = this.game.state.world.report;
      if (prior) {
        for (const field of ["cause", "responsible", "policy"]) {
          const input = this.overlay.querySelector(`input[name="report-${field}"][value="${prior[field]}"]`);
          if (input) input.checked = true;
        }
        DOM.id("reportNote").value = prior.note || "";
      }
    }

    pill(label, ok) {
      return `<span class="status-pill ${ok ? "status-positive" : "status-warning"}">${ok ? "✓" : "△"} ${label}</span>`;
    }

    renderOptions(targetId, field, options) {
      DOM.setHTML(DOM.id(targetId), options.map((option) => `<label class="report-option"><input type="radio" name="report-${field}" value="${option.id}"><span><b>${Util.escapeHTML(option.title)}</b><small>${Util.escapeHTML(option.detail)}</small></span></label>`).join(""));
    }

    submit() {
      const pick = (field) => this.overlay.querySelector(`input[name="report-${field}"]:checked`)?.value;
      const report = {
        cause: pick("cause"),
        responsible: pick("responsible"),
        policy: pick("policy"),
        note: DOM.id("reportNote").value.trim(),
      };
      const result = this.game.endings.submit(report);
      if (!result.success) {
        this.game.bus.emit("ui:notify", { title: "報告書を確定できない", text: result.error, icon: "!", tone: "danger" });
        return;
      }
      this.close(false);
    }

    close(resume = true) {
      DOM.hide(this.overlay);
      if (resume && this.game.state.mode === "exploration") this.game.state.paused = false;
    }
  }

  H.UI.ReportPanel = ReportPanel;
})(window.Haimachi);
