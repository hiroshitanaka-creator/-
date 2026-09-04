(function registerDialoguePanel(H) {
  "use strict";

  const { DOM } = H.UI;
  const { Util } = H.Core;

  class DialoguePanel {
    constructor(game) {
      this.game = game;
      this.overlay = DOM.id("dialogueOverlay");
      this.speaker = DOM.id("dialogueSpeaker");
      this.role = DOM.id("dialogueRole");
      this.text = DOM.id("dialogueText");
      this.choices = DOM.id("dialogueChoices");
      this.trust = DOM.id("dialogueTrust");
      this.initial = DOM.id("dialogueInitial");
      DOM.id("dialogueCloseButton")?.addEventListener("click", () => this.game.dialogue.close());
    }

    open(payload) {
      this.render(payload);
      DOM.show(this.overlay);
    }

    render({ npc, npcState, text, topics }) {
      DOM.setText(this.speaker, npc.name);
      DOM.setText(this.role, npc.role);
      DOM.setText(this.initial, npc.glyph || npc.shortName?.[0] || "?");
      DOM.setHTML(this.text, Util.multiline(text));
      DOM.setHTML(this.trust, `<span>信頼</span><b>${Math.round(npcState.trust)}</b>`);
      const html = topics.length ? topics.map((topic) => `
        <section class="dialogue-topic"><div><b>${Util.escapeHTML(topic.label)}</b><small>${Util.escapeHTML(topic.summary || "")}</small></div>
          ${topic.options.map((option) => `<button class="dialogue-choice" data-dialogue-topic="${topic.id}" data-dialogue-option="${option.id}"><b>${Util.escapeHTML(option.label)}</b>${option.hint ? `<small>${Util.escapeHTML(option.hint)}</small>` : ""}</button>`).join("")}
        </section>`).join("") : `<div class="empty-state">今聞ける新しい話題はない。別の証拠を集めてから戻ると、証言が変わることがあります。</div>`;
      DOM.setHTML(this.choices, html);
      this.choices.querySelectorAll("[data-dialogue-option]").forEach((button) => button.addEventListener("click", () => {
        this.game.dialogue.choose(npc.id, button.dataset.dialogueTopic, button.dataset.dialogueOption);
      }));
    }

    close() { DOM.hide(this.overlay); }
  }

  H.UI.DialoguePanel = DialoguePanel;
})(window.Haimachi);
