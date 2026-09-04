(function registerCombatPanel(H) {
  "use strict";

  const { DOM } = H.UI;
  const { Util } = H.Core;

  class CombatPanel {
    constructor(game) {
      this.game = game;
      this.overlay = DOM.id("combatOverlay");
      this.actions = DOM.id("combatActions");
      this.picker = DOM.id("combatPicker");
      this.finished = false;
    }

    open(snapshot) {
      this.finished = false;
      DOM.show(this.overlay);
      this.render(snapshot);
    }

    render(snapshot) {
      if (!snapshot) return;
      const { enemy, phase } = snapshot;
      DOM.setText(DOM.id("enemyName"), enemy.name);
      DOM.setText(DOM.id("enemyClaim"), phase?.claim || enemy.subtitle);
      DOM.setText(DOM.id("panicText"), snapshot.panic);
      DOM.setText(DOM.id("focusText"), snapshot.focus);
      DOM.setText(DOM.id("authorityText"), snapshot.authority);
      DOM.setText(DOM.id("enemyIntegrityText"), `${Math.ceil(snapshot.integrity)} / ${snapshot.maxIntegrity}`);
      DOM.id("enemyIntegrityFill").style.width = DOM.percent(snapshot.integrity, snapshot.maxIntegrity);
      const log = snapshot.log.slice(-5).map((entry) => `<div class="combat-log-line is-${entry.speaker}">${Util.escapeHTML(entry.text)}</div>`).join("");
      DOM.setHTML(DOM.id("combatLog"), log);
      if (this.finished) return;
      const hasShard = Boolean(this.game.state.player.inventory.resonant_shard) && !snapshot.resonantUsed;
      DOM.setHTML(this.actions, `
        <button class="combat-action" data-combat-action="observe"><b>観察</b><small>弱点を読む／集中+1</small></button>
        <button class="combat-action" data-combat-action="evidence"><b>証拠提示</b><small>現在の主張を崩す</small></button>
        <button class="combat-action" data-combat-action="deduction"><b>推理固定</b><small>集中1／大きな効果</small></button>
        <button class="combat-action" data-combat-action="calm"><b>鎮静</b><small>平静回復／不安低下</small></button>
        <button class="combat-action" data-combat-action="seal" ${snapshot.authority <= 0 ? "disabled" : ""}><b>行政封印</b><small>権限を消費</small></button>
        ${hasShard ? `<button class="combat-action" data-combat-action="resonance"><b>基準音</b><small>一度だけ反撃遮断</small></button>` : `<button class="combat-action" data-combat-action="retreat"><b>撤退</b><small>噂圧増加／再挑戦可能</small></button>`}
      `);
      this.actions.querySelectorAll("[data-combat-action]").forEach((button) => button.addEventListener("click", () => this.handleAction(button.dataset.combatAction)));
    }

    handleAction(action) {
      this.hidePicker();
      if (action === "observe") this.game.combat.observe();
      else if (action === "calm") this.game.combat.calm();
      else if (action === "seal") this.game.combat.seal();
      else if (action === "resonance") this.game.combat.useResonantShard();
      else if (action === "retreat") this.game.combat.retreat();
      else if (action === "evidence") this.showEvidencePicker();
      else if (action === "deduction") this.showDeductionPicker();
    }

    showEvidencePicker() {
      const phase = this.game.combat.currentPhase();
      const cards = this.game.evidence.discovered().map((entry) => {
        const overlap = entry.tags.filter((tag) => phase.weaknessTags.includes(tag)).length;
        return `<button data-combat-evidence="${entry.id}"><b>${entry.icon} ${Util.escapeHTML(entry.title)}</b><small>${Util.escapeHTML(entry.tags.join("・"))}${overlap ? ` ／ 論点一致 ${overlap}` : ""}</small></button>`;
      }).join("");
      this.showPicker("提示する証拠", cards || `<div class="empty-state">証拠がない。</div>`);
      this.picker.querySelectorAll("[data-combat-evidence]").forEach((button) => button.addEventListener("click", () => { this.hidePicker(); this.game.combat.presentEvidence(button.dataset.combatEvidence); }));
    }

    showDeductionPicker() {
      const phase = this.game.combat.currentPhase();
      const cards = this.game.state.deductions.solved.map((id) => H.Data.DeductionById[id]).filter(Boolean).map((entry) => {
        const overlap = entry.tags.filter((tag) => phase.weaknessTags.includes(tag)).length;
        return `<button data-combat-deduction="${entry.id}"><b>理 ${Util.escapeHTML(entry.shortTitle)}</b><small>${Util.escapeHTML(entry.shortResult)}${overlap ? ` ／ 論点一致 ${overlap}` : ""}</small></button>`;
      }).join("");
      this.showPicker("固定する推理", cards || `<div class="empty-state">成立済みの推理がない。いったん撤退し、推理盤で証拠をつないでください。</div>`);
      this.picker.querySelectorAll("[data-combat-deduction]").forEach((button) => button.addEventListener("click", () => { this.hidePicker(); this.game.combat.invokeDeduction(button.dataset.combatDeduction); }));
    }

    showPicker(title, cards) {
      DOM.setHTML(this.picker, `<header><h3>${Util.escapeHTML(title)}</h3><button class="icon-button" data-close-combat-picker>×</button></header><div class="combat-picker-grid">${cards}</div>`);
      this.picker.classList.remove("is-hidden");
      this.picker.querySelector("[data-close-combat-picker]")?.addEventListener("click", () => this.hidePicker());
    }

    hidePicker() { this.picker.classList.add("is-hidden"); }

    finish({ victory, enemy, text, snapshot }) {
      this.finished = true;
      if (snapshot) this.render(snapshot);
      DOM.setHTML(this.actions, `<div class="combat-outcome ${victory ? "is-victory" : "is-defeat"}"><h3>${victory ? "噂を分解した" : "対峙を中断した"}</h3><p>${Util.escapeHTML(text)}</p><button class="button ${victory ? "button-primary" : "button-secondary"}" data-close-combat>街へ戻る</button></div>`);
      this.actions.querySelector("[data-close-combat]")?.addEventListener("click", () => this.close());
      DOM.setText(DOM.id("enemyClaim"), victory ? "主張は証拠と推理へ分解された。" : enemy.subtitle);
    }

    close() { DOM.hide(this.overlay); this.hidePicker(); this.finished = false; this.game.bus.emit("combat:overlayClosed", {}); }
  }

  H.UI.CombatPanel = CombatPanel;
})(window.Haimachi);
