(function registerUIManager(H) {
  "use strict";

  const { DOM } = H.UI;
  const { Util } = H.Core;

  class UIManager {
    constructor(game) {
      this.game = game;
      this.root = DOM.id("app");
      this.titleScreen = DOM.id("titleScreen");
      this.storyScreen = DOM.id("storyScreen");
      this.hud = DOM.id("hud");
      this.quickBar = DOM.id("quickBar");
      this.drawer = DOM.id("sideDrawer");
      this.drawerContent = DOM.id("drawerContent");
      this.interactionPrompt = DOM.id("interactionPrompt");
      this.locationBanner = DOM.id("locationBanner");
      this.credits = DOM.id("creditsOverlay");
      this.levelOverlay = DOM.id("levelOverlay");
      this.endingOverlay = DOM.id("endingOverlay");
      this.panelRenderer = new H.UI.PanelRenderer(game);
      this.deductionBoard = new H.UI.DeductionBoard(game);
      this.dialoguePanel = new H.UI.DialoguePanel(game);
      this.combatPanel = new H.UI.CombatPanel(game);
      this.reportPanel = new H.UI.ReportPanel(game);
      this.touch = new H.UI.TouchControls(game);
      this.activePanel = null;
      this.story = null;
      this.storyIndex = 0;
      this.storyDone = null;
      this.locationTimer = null;
      this.queuedStory = null;
      this.pendingLevel = false;
      this.lastHUDUpdate = 0;
      this.bindStaticEvents();
      this.bindBus();
      this.refreshContinueButton();
      this.applySettings();
    }

    bindStaticEvents() {
      DOM.id("newGameButton")?.addEventListener("click", async () => {
        await this.game.audio.unlock();
        const name = DOM.id("playerName").value;
        const difficulty = document.querySelector('input[name="difficulty"]:checked')?.value || "investigator";
        this.game.startNew({ playerName: name, difficulty });
      });
      DOM.id("continueButton")?.addEventListener("click", async () => {
        await this.game.audio.unlock();
        this.game.continueGame();
      });
      DOM.id("titleSettingsButton")?.addEventListener("click", () => this.openDrawer("settings"));
      DOM.id("titleCreditsButton")?.addEventListener("click", () => DOM.show(this.credits));
      DOM.id("creditsCloseButton")?.addEventListener("click", () => DOM.hide(this.credits));
      DOM.id("storyNextButton")?.addEventListener("click", () => this.nextStory());
      DOM.id("storySkipButton")?.addEventListener("click", () => this.finishStory());
      DOM.all("[data-panel]").forEach((button) => button.addEventListener("click", () => this.toggleDrawer(button.dataset.panel)));
      DOM.all("[data-close-drawer]").forEach((button) => button.addEventListener("click", () => this.closeDrawer()));
      DOM.id("objectiveChip")?.addEventListener("click", () => this.openDrawer("journal"));
      DOM.id("timeButton")?.addEventListener("click", () => this.openDrawer("journal"));
      DOM.id("investigationCloseButton")?.addEventListener("click", () => this.game.interactions.closeInvestigation());
      DOM.id("endingContinueButton")?.addEventListener("click", () => this.game.endings.enterPostgame());
      DOM.id("endingNewGameButton")?.addEventListener("click", () => this.game.returnToTitle(true));
      DOM.id("endingExportButton")?.addEventListener("click", () => this.game.saveManager.export(this.game.state));
      DOM.id("endingTransferButton")?.addEventListener("click", () => {
        const result = this.game.transfer?.exportChapter2Transfer();
        if (result?.success) this.notify({ title: "第二章への継承データを作成", text: "第二章タイトル画面で読み込めるJSONを書き出しました。", icon: "継", tone: "success" });
        else this.notify({ title: "継承データを作れない", text: result?.error || "第一章の正式報告後に作成できます。", icon: "!", tone: "warning" });
      });
      DOM.id("endingProceedChapter2Button")?.addEventListener("click", () => this.proceedToChapter2());
    }

    bindBus() {
      const bus = this.game.bus;
      bus.on("interaction:changed", ({ item }) => this.showInteraction(item));
      bus.on("world:mapChanged", ({ map }) => this.showLocation(map));
      bus.on("ui:notify", (note) => this.notify(note));
      bus.on("dialogue:open", (payload) => this.dialoguePanel.open(payload));
      bus.on("dialogue:update", (payload) => this.dialoguePanel.render(payload));
      bus.on("dialogue:close", () => this.dialoguePanel.close());
      bus.on("investigation:open", (payload) => this.openInvestigation(payload));
      bus.on("investigation:result", (payload) => this.showInvestigationResult(payload));
      bus.on("investigation:close", () => DOM.hide(DOM.id("investigationOverlay")));
      bus.on("combat:open", (snapshot) => this.combatPanel.open(snapshot));
      bus.on("combat:update", (snapshot) => this.combatPanel.render(snapshot));
      bus.on("combat:finish", (payload) => this.combatPanel.finish(payload));
      bus.on("combat:overlayClosed", () => this.flushQueuedStory());
      bus.on("progression:level", () => { this.pendingLevel = true; });
      bus.on("progression:statChosen", () => this.renderLevelChoices());
      bus.on("report:open", () => this.reportPanel.open());
      bus.on("story:request", ({ id }) => this.requestStory(id));
      bus.on("ending:show", (payload) => this.showEnding(payload));
      bus.on("ending:close", () => DOM.hide(this.endingOverlay));
      bus.on("save:completed", ({ slot }) => { if (slot === "manual") this.notify({ title: "巡察記録を保存", text: "手動セーブが完了した。", icon: "保", tone: "success" }); this.refreshContinueButton(); });
      bus.on("save:failed", () => this.notify({ title: "保存できない", text: "ブラウザの保存領域を確認してください。", icon: "!", tone: "danger" }));
      bus.on("evidence:discovered", () => this.refreshDrawerIfOpen());
      bus.on("deduction:solved", () => this.refreshDrawerIfOpen());
      bus.on("quest:stageCompleted", () => this.refreshDrawerIfOpen());
    }

    showTitle() {
      DOM.show(this.titleScreen);
      this.hud.classList.add("is-hidden");
      this.quickBar.classList.add("is-hidden");
      this.touch.setVisible(false);
      this.root.dataset.mode = "title";
      this.refreshContinueButton();
    }

    hideTitle() { DOM.hide(this.titleScreen); }

    enterExploration() {
      this.hideTitle();
      this.hud.classList.remove("is-hidden");
      this.quickBar.classList.remove("is-hidden");
      this.touch.setVisible(true);
      this.root.dataset.mode = "exploration";
      this.showLocation(this.game.world.currentMap);
      this.updateHUD(true);
    }

    refreshContinueButton() {
      const button = DOM.id("continueButton");
      const summary = this.game.saveManager.getSummary();
      if (!button) return;
      button.disabled = !summary;
      if (summary) button.innerHTML = `続きから<small style="display:block;font-size:.65rem">${Util.escapeHTML(summary.name)}・${Util.formatDay(summary.day)}・${Util.formatPlaytime(summary.playtimeSeconds)}</small>`;
      else button.textContent = "続きから";
    }

    showStory(sequenceId, onDone = null) {
      const sequence = H.Data.StorySequences[sequenceId];
      if (!sequence?.length) { onDone?.(); return false; }
      this.story = sequence;
      this.storyIndex = 0;
      this.storyDone = onDone;
      this.game.state.paused = true;
      DOM.show(this.storyScreen);
      this.renderStoryPage();
      return true;
    }

    requestStory(id) {
      if (this.game.state.combat || this.combatPanel.overlay.classList.contains("is-visible")) {
        this.queuedStory = id;
        return;
      }
      this.showStory(id, () => {
        if (this.game.state.mode !== "ending") this.game.state.paused = false;
      });
    }

    flushQueuedStory() {
      if (!this.queuedStory) return;
      const id = this.queuedStory;
      this.queuedStory = null;
      this.requestStory(id);
    }

    renderStoryPage() {
      const page = this.story?.[this.storyIndex];
      if (!page) return this.finishStory();
      DOM.setText(DOM.id("storyKicker"), page.kicker);
      DOM.setText(DOM.id("storyTitle"), page.title);
      DOM.setHTML(DOM.id("storyBody"), page.body.map((text) => `<p>${Util.escapeHTML(text)}</p>`).join(""));
      DOM.id("storyProgressFill").style.width = `${((this.storyIndex + 1) / this.story.length) * 100}%`;
      DOM.setText(DOM.id("storyNextButton"), this.storyIndex === this.story.length - 1 ? "巡察へ" : "次へ");
    }

    nextStory() {
      this.storyIndex += 1;
      if (this.storyIndex >= this.story.length) this.finishStory();
      else this.renderStoryPage();
    }

    finishStory() {
      DOM.hide(this.storyScreen);
      const done = this.storyDone;
      this.story = null;
      this.storyDone = null;
      done?.();
    }

    toggleDrawer(panel) {
      if (this.drawer.classList.contains("is-open") && this.activePanel === panel) this.closeDrawer();
      else this.openDrawer(panel);
    }

    openDrawer(panel) {
      if (["dialogue", "combat", "ending"].includes(this.game.state.mode)) return;
      this.activePanel = panel;
      this.game.state.ui.activePanel = panel;
      this.game.state.paused = true;
      this.drawer.classList.add("is-open");
      this.drawer.setAttribute("aria-hidden", "false");
      DOM.all(".drawer-tabs [data-panel]").forEach((button) => button.classList.toggle("is-active", button.dataset.panel === panel));
      const titles = { journal: ["巡察記録", "記録帳"], evidence: ["採用可能な事実", "証拠台帳"], deduction: ["関係を証明する", "推理盤"], map: ["街の状態", "認証地図"], people: ["信頼と沈黙", "人物台帳"], settings: ["保存・表示・拡張", "設定"] };
      DOM.setText(DOM.id("drawerEyebrow"), titles[panel]?.[0] || "巡察記録");
      DOM.setText(DOM.id("drawerTitle"), titles[panel]?.[1] || "記録帳");
      this.renderDrawer();
    }

    renderDrawer() {
      if (!this.drawer.classList.contains("is-open")) return;
      if (this.activePanel === "deduction") this.deductionBoard.mount(this.drawerContent);
      else {
        this.drawerContent.innerHTML = this.panelRenderer.render(this.activePanel);
        this.bindDrawerContent();
      }
    }

    refreshDrawerIfOpen() { if (this.drawer.classList.contains("is-open")) this.renderDrawer(); }

    bindDrawerContent() {
      this.drawerContent.querySelectorAll("[data-evidence-filter]").forEach((button) => button.addEventListener("click", () => {
        this.game.state.ui.evidenceFilter = button.dataset.evidenceFilter;
        this.panelRenderer.evidenceDetailId = null;
        this.renderDrawer();
      }));
      this.drawerContent.querySelectorAll("[data-evidence-id]").forEach((card) => card.addEventListener("click", () => {
        this.game.evidence.review(card.dataset.evidenceId);
        this.panelRenderer.evidenceDetailId = card.dataset.evidenceId;
        this.renderDrawer();
      }));
      this.drawerContent.querySelector("[data-evidence-detail-close]")?.addEventListener("click", () => { this.panelRenderer.evidenceDetailId = null; this.renderDrawer(); });
      this.drawerContent.querySelectorAll("[data-travel-map]").forEach((button) => button.addEventListener("click", () => {
        if (this.game.world.fastTravel(button.dataset.travelMap)) this.closeDrawer(false);
      }));
      this.drawerContent.querySelectorAll("[data-setting]").forEach((input) => input.addEventListener("change", () => {
        this.game.state.settings[input.dataset.setting] = input.checked;
        this.applySettings();
        this.game.saveManager.saveSettings(this.game.state.settings);
        this.renderDrawer();
      }));
      this.drawerContent.querySelectorAll("[data-setting-range]").forEach((input) => input.addEventListener("input", () => {
        this.game.state.settings[input.dataset.settingRange] = Number(input.value);
        this.applySettings();
        this.game.saveManager.saveSettings(this.game.state.settings);
      }));
      this.drawerContent.querySelector("[data-save-manual]")?.addEventListener("click", () => this.game.saveManager.save(this.game.state, "manual", "menu"));
      this.drawerContent.querySelector("[data-load-save]")?.addEventListener("click", () => { if (confirm("保存時点へ戻りますか？未保存の進行は失われます。")) { this.closeDrawer(false); this.game.continueGame(); } });
      this.drawerContent.querySelector("[data-export-save]")?.addEventListener("click", () => this.game.saveManager.export(this.game.state));
      this.drawerContent.querySelector("[data-export-chapter-transfer]")?.addEventListener("click", () => {
        const result = this.game.transfer?.exportChapter2Transfer();
        if (result?.success) this.notify({ title: "継承データを書き出し", text: "第二章で読み込める第一章の要約データを保存しました。", icon: "継", tone: "success" });
        else this.notify({ title: "継承データを作れない", text: result?.error || "正式報告後に実行してください。", icon: "!", tone: "warning" });
      });
      this.drawerContent.querySelector("[data-proceed-chapter2]")?.addEventListener("click", () => this.proceedToChapter2());
      this.drawerContent.querySelector("[data-import-save]")?.addEventListener("change", async (event) => {
        const file = event.target.files?.[0]; if (!file) return;
        try { const loaded = await this.game.saveManager.import(file); this.closeDrawer(false); this.game.loadState(loaded); this.notify({ title: "巡察記録を読み込んだ", text: "書き出しファイルから状態を復元した。", icon: "復", tone: "success" }); }
        catch (error) { this.notify({ title: "読み込み失敗", text: error.message, icon: "!", tone: "danger" }); }
      });
      this.drawerContent.querySelector("[data-return-title]")?.addEventListener("click", () => { this.game.saveManager.autoSave(this.game.state, "return title"); this.closeDrawer(false); this.game.returnToTitle(); });
      this.drawerContent.querySelector("[data-delete-save]")?.addEventListener("click", () => { if (confirm("すべての巡察セーブを削除しますか？")) { this.game.saveManager.deleteAll(); this.refreshContinueButton(); this.notify({ title: "セーブを削除", text: "ブラウザ内の巡察記録を削除した。", icon: "消", tone: "warning" }); } });
    }

    closeDrawer(resume = true) {
      this.drawer.classList.remove("is-open");
      this.drawer.setAttribute("aria-hidden", "true");
      this.activePanel = null;
      this.game.state.ui.activePanel = null;
      if (resume && this.game.state.mode === "exploration" && !this.isModalOpen()) this.game.state.paused = false;
    }

    showInteraction(item) {
      if (!item) { this.interactionPrompt.classList.add("is-hidden"); return; }
      DOM.setText(DOM.id("interactionKey"), matchMedia("(pointer: coarse)").matches ? "調" : "E");
      DOM.setText(DOM.id("interactionText"), item.prompt);
      this.interactionPrompt.classList.remove("is-hidden");
    }

    showLocation(map) {
      if (!map) return;
      const district = H.Data.Config.districts.find((entry) => entry.id === map.district);
      DOM.setText(DOM.id("locationDistrict"), district?.name || "灰街");
      DOM.setText(DOM.id("locationName"), map.name);
      DOM.setText(DOM.id("locationFlavor"), map.flavor);
      this.locationBanner.classList.add("is-active");
      clearTimeout(this.locationTimer);
      this.locationTimer = setTimeout(() => this.locationBanner.classList.remove("is-active"), 4200);
    }

    notify({ title = "巡察記録", text = "", icon = "◇", tone = "normal" }) {
      const stack = DOM.id("notificationStack");
      const note = document.createElement("article");
      note.className = `notification tone-${tone}`;
      note.innerHTML = `<span class="notification-icon">${Util.escapeHTML(icon)}</span><span><b>${Util.escapeHTML(title)}</b><small>${Util.escapeHTML(text)}</small></span>`;
      stack.appendChild(note);
      while (stack.children.length > 5) stack.firstElementChild.remove();
      setTimeout(() => { note.classList.add("is-leaving"); setTimeout(() => note.remove(), 300); }, 4300);
    }

    openInvestigation({ hotspot, actions }) {
      const overlay = DOM.id("investigationOverlay");
      DOM.setText(DOM.id("investigationTitle"), hotspot.title);
      DOM.setText(DOM.id("investigationDescription"), hotspot.description);
      DOM.setHTML(DOM.id("investigationVisual"), `<div class="investigation-symbol">${this.visualGlyph(hotspot.visual)}</div><div class="investigation-scan-lines"></div>`);
      DOM.setHTML(DOM.id("investigationActions"), actions.length ? actions.map((action) => `<button class="button button-secondary" data-investigation-action="${action.id}"><b>${Util.escapeHTML(action.label)}</b><small style="display:block">${Util.escapeHTML(action.detail || "")}${action.timeCost ? ` ／ 時間 ${action.timeCost}` : ""}</small></button>`).join("") : `<div class="empty-state">現在実行できる調査はない。別の証拠や道具が必要です。</div>`);
      DOM.setText(DOM.id("investigationResult"), "現場のどこへ注目するか選んでください。失敗しても別経路から証拠を得られる場合があります。");
      DOM.id("investigationActions").querySelectorAll("[data-investigation-action]").forEach((button) => button.addEventListener("click", () => this.game.interactions.performInvestigation(hotspot.id, button.dataset.investigationAction)));
      DOM.show(overlay);
    }

    showInvestigationResult({ success, text, checkText }) {
      const target = DOM.id("investigationResult");
      target.classList.toggle("is-success", success);
      DOM.setText(target, `${success ? "調査成功" : "調査不成立"}${checkText ? `（${checkText}）` : ""}\n${text || ""}`);
      DOM.id("investigationActions").querySelectorAll("button").forEach((button) => { button.disabled = true; });
    }

    visualGlyph(type) {
      const glyphs = { map: "図", documents: "録", paper: "紙", seal: "印", poster: "告", crowd: "衆", tracks: "爪", blood: "血", bell: "鐘", mud: "泥", metal: "金", medicine: "薬", ledger: "帳", crystal: "灰", grate: "格", crate: "荷" };
      return glyphs[type] || "調";
    }

    renderLevelChoices() {
      const player = this.game.state.player;
      if (player.pendingLevelUps <= 0) {
        DOM.hide(this.levelOverlay);
        this.pendingLevel = false;
        if (this.game.state.mode === "exploration" && !this.isModalOpen()) this.game.state.paused = false;
        return;
      }
      DOM.setHTML(DOM.id("levelChoices"), Object.entries(H.Data.Config.progression.levelRewards).map(([id, data]) => `<button class="level-choice" data-level-stat="${id}" ${player.stats[id] >= 6 ? "disabled" : ""}><span>${data.glyph} ${data.title}　${player.stats[id]}→${Math.min(6,player.stats[id]+1)}</span><p>${Util.escapeHTML(data.description)}</p><small>${Util.escapeHTML(data.bonuses.join("／"))}</small></button>`).join(""));
      DOM.id("levelChoices").querySelectorAll("[data-level-stat]").forEach((button) => button.addEventListener("click", () => this.game.progression.chooseStat(button.dataset.levelStat)));
      this.game.state.paused = true;
      DOM.show(this.levelOverlay);
    }

    maybeShowLevel() {
      if (!this.pendingLevel || this.game.state.player.pendingLevelUps <= 0) return;
      if (this.isModalOpen()) return;
      this.renderLevelChoices();
    }

    showEnding({ ending, report, readiness }) {
      DOM.setText(DOM.id("endingKicker"), ending.kicker);
      DOM.setText(DOM.id("endingTitle"), ending.title);
      DOM.setHTML(DOM.id("endingBody"), ending.body.map((paragraph) => `<p>${Util.escapeHTML(paragraph)}</p>`).join("") + `<p><b>${Util.escapeHTML(ending.epilogue)}</b></p>`);
      const cause = H.Data.Config.reportOptions.cause.find((entry) => entry.id === report.cause)?.title;
      const responsible = H.Data.Config.reportOptions.responsible.find((entry) => entry.id === report.responsible)?.title;
      const policy = H.Data.Config.reportOptions.policy.find((entry) => entry.id === report.policy)?.title;
      DOM.setHTML(DOM.id("endingSummary"), `<article><small>認定原因</small><b>${Util.escapeHTML(cause)}</b></article><article><small>責任主体</small><b>${Util.escapeHTML(responsible)}</b></article><article><small>公開方針</small><b>${Util.escapeHTML(policy)}</b></article><article><small>証拠</small><b>${readiness.evidenceCount}件</b></article><article><small>主要推理</small><b>${readiness.solvedKey}/${readiness.requiredKey}</b></article><article><small>街の安定</small><b>${Math.round(readiness.stability)}</b></article>`);
      const transfer = this.game.transfer?.canExport?.() ? this.game.transfer.build() : null;
      const bridge = DOM.id("endingSeriesBridge");
      if (bridge) {
        const rescue = readiness.eldRescued ? "エルド救出済み" : "エルド救出不十分";
        const witness = readiness.witnessProtection ? "証人保護済み" : "証人保護未完";
        const bell = readiness.bellRepaired ? "雨鐘修復済み" : "雨鐘未修復";
        bridge.innerHTML = transfer ? `
          <p class="eyebrow">章間ブリーフィング準備</p>
          <h3>この結末は第二章の初期条件へ反映されます</h3>
          <p>継承型：<b>${Util.escapeHTML(transfer.chapter.profileLabel)}</b>。${Util.escapeHTML(rescue)}、${Util.escapeHTML(witness)}、${Util.escapeHTML(bell)}。第二章では、この公式記録を黒雨が読み取り、NPC信頼・噂圧・派閥姿勢を変化させます。</p>
        ` : `<p>正式報告後に、第二章へ渡す継承記録を作成できます。</p>`;
      }
      DOM.show(this.endingOverlay);
      this.root.dataset.mode = "ending";
    }

    chapter2Url() {
      const path = window.location?.pathname || "";
      if (path.includes("/haimachi_chapter1_transfer/dist/")) return "../../haimachi_chapter2_inheritance/index.html?inherit=1&from=chapter1";
      if (path.includes("haimachi_chapter1_transfer")) return "../haimachi_chapter2_inheritance/index.html?inherit=1&from=chapter1";
      if (path.includes("haimachi_chapter1") || path.includes("chapter1")) return "haimachi_season1_chapter2_finale_standalone.html?inherit=1&from=chapter1";
      return "../haimachi_chapter2_inheritance/index.html?inherit=1&from=chapter1";
    }

    proceedToChapter2() {
      const result = this.game.transfer?.persist(this.game.state);
      if (!result?.success) {
        this.notify({ title: "第二章へ進めない", text: result?.error || "第一章の正式報告後に実行してください。", icon: "!", tone: "warning" });
        return false;
      }
      this.game.saveManager.autoSave(this.game.state, "chapter bridge to chapter2");
      this.notify({ title: "第二章へ継承", text: "継承記録を保存しました。第二章の章間ブリーフィングへ移動します。", icon: "継", tone: "success" });
      window.setTimeout(() => { window.location.href = this.chapter2Url(); }, 350);
      return true;
    }

    updateHUD(force = false) {
      const now = performance.now();
      if (!force && now - this.lastHUDUpdate < 120) return;
      this.lastHUDUpdate = now;
      const state = this.game.state;
      const player = state.player;
      DOM.setText(DOM.id("hudPlayerName"), player.name);
      DOM.setText(DOM.id("hudRank"), player.rank);
      DOM.setText(DOM.id("composureText"), Math.round(player.composure));
      DOM.id("composureFill").style.width = DOM.percent(player.composure, player.maxComposure);
      DOM.setText(DOM.id("trustText"), Math.round(state.world.publicTrust));
      DOM.id("trustFill").style.width = DOM.percent(state.world.publicTrust);
      DOM.setText(DOM.id("dayText"), Util.formatDay(state.world.day));
      DOM.setText(DOM.id("segmentText"), Util.segmentName(state.world.segment));
      DOM.setText(DOM.id("weatherText"), state.world.weather);
      DOM.setText(DOM.id("stabilityText"), Math.round(state.world.stability));
      DOM.setText(DOM.id("rumorText"), `噂圧 ${Math.round(state.world.globalRumorPressure)}`);
      DOM.setText(DOM.id("objectiveText"), this.game.quests.trackedObjective().title);
      document.body.classList.toggle("no-rain", state.settings.rainOverlay === false);
      document.body.classList.toggle("bright-exploration", state.settings.brightExploration !== false);
      const coarsePointer = window.matchMedia?.("(pointer: coarse)")?.matches || false;
      const mobileViewport = window.innerWidth <= 768 || coarsePointer;
      const brightExploration = state.settings.brightExploration !== false;
      const rainBase = brightExploration ? (mobileViewport ? 0.012 : 0.02) : 0.04;
      const rainScale = brightExploration ? (mobileViewport ? 0.07 : 0.10) : 0.22;
      DOM.id("rainGlass").style.opacity = String(rainBase + (this.game.world.currentMap?.ambient?.rain || 0) * rainScale);
      this.maybeShowLevel();
    }

    applySettings() {
      const s = this.game.state.settings;
      document.body.classList.toggle("high-contrast", Boolean(s.highContrast));
      document.body.classList.toggle("font-large", Boolean(s.fontLarge));
      document.body.classList.toggle("reduce-motion", Boolean(s.reducedMotion));
      document.body.classList.toggle("no-rain", s.rainOverlay === false);
      document.body.classList.toggle("bright-exploration", s.brightExploration !== false);
      this.game.audio.configure(s);
    }

    isModalOpen() {
      return this.drawer.classList.contains("is-open") ||
        DOM.all(".modal-overlay.is-visible, .screen-overlay.is-visible").some((element) => !element.classList.contains("title-screen"));
    }

    closeTop() {
      if (this.storyScreen.classList.contains("is-visible")) return this.finishStory();
      if (this.credits.classList.contains("is-visible")) return DOM.hide(this.credits);
      if (this.game.state.dialogue) return this.game.dialogue.close();
      if (this.game.state.investigation) return this.game.interactions.closeInvestigation();
      if (this.reportPanel.overlay.classList.contains("is-visible")) return this.reportPanel.close();
      if (this.drawer.classList.contains("is-open")) return this.closeDrawer();
      this.openDrawer("settings");
    }
  }

  H.UI.UIManager = UIManager;
})(window.Haimachi);
