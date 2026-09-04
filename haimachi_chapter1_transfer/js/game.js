(function registerGame(H) {
  "use strict";

  const { EventBus, StateFactory, SaveManager, AudioManager, InputManager } = H.Core;

  class Game {
    constructor() {
      this.bus = new EventBus();
      this.saveManager = new SaveManager(this.bus);
      this.audio = new AudioManager(this.bus);
      this.input = new InputManager(this.bus);
      this.state = StateFactory.createNew({ playerName: "レイ", difficulty: "investigator", seed: "title-preview" });
      this.state.mode = "title";
      this.state.paused = true;
      const persistedSettings = this.saveManager.loadSettings();
      if (persistedSettings) this.state.settings = { ...this.state.settings, ...persistedSettings };

      this.effects = new H.Systems.EffectSystem(this);
      this.time = new H.Systems.TimeSystem(this);
      this.world = new H.Systems.WorldSystem(this);
      this.movement = new H.Systems.MovementSystem(this);
      this.interactions = new H.Systems.InteractionSystem(this);
      this.evidence = new H.Systems.EvidenceSystem(this);
      this.dialogue = new H.Systems.DialogueSystem(this);
      this.deductions = new H.Systems.DeductionSystem(this);
      this.quests = new H.Systems.QuestSystem(this);
      this.rumors = new H.Systems.RumorSystem(this);
      this.combat = new H.Systems.CombatSystem(this);
      this.progression = new H.Systems.ProgressionSystem(this);
      this.transfer = new H.Systems.ChapterTransfer(this);
      this.endings = new H.Systems.EndingSystem(this);
      this.mcp = new H.Systems.MCPBridge(this);

      this.renderer = new H.Render.CanvasRenderer(this, document.getElementById("gameCanvas"));
      this.combatRenderer = new H.Render.CombatRenderer(this, document.getElementById("combatCanvas"));
      this.ui = new H.UI.UIManager(this);
      this.interactions.refresh();
      this.dirty = false;
      this.lastFrame = performance.now();
      this.playtimeAccumulator = 0;
      this.running = true;
      this.bindRuntimeEvents();
      this.exposeDebugAPI();
      requestAnimationFrame((time) => this.frame(time));
    }

    bindRuntimeEvents() {
      this.bus.on("input:action", ({ action }) => this.handleAction(action));
      this.bus.on("mcp:proposal", ({ proposal }) => {
        this.addEvent(`MCP候補を受理（正式状態へ未反映）：${proposal.type}`, "mcp");
      });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden && this.state.mode !== "title") this.saveManager.autoSave(this.state, "visibility change");
      });
      window.addEventListener("beforeunload", () => {
        if (this.state.mode !== "title") this.saveManager.autoSave(this.state, "window close");
      });
    }

    startNew({ playerName, difficulty }) {
      const preserved = { ...this.state.settings, ...(this.saveManager.loadSettings() || {}) };
      this.state = StateFactory.createNew({ playerName, difficulty, seed: `${playerName}-${Date.now()}` });
      this.state.settings = { ...this.state.settings, ...preserved, difficulty };
      this.state.mode = "story";
      this.state.paused = true;
      this.resetRuntimeForState();
      this.ui.hideTitle();
      this.ui.applySettings();
      this.ui.showStory("intro", () => this.finishIntro());
      this.saveManager.autoSave(this.state, "new game");
    }

    finishIntro() {
      this.state.mode = "exploration";
      this.state.paused = false;
      this.ui.enterExploration();
      this.world.enterMap(this.state.player.mapId, this.state.player.x, this.state.player.y, { force: true });
      this.bus.emit("ui:notify", {
        title: "最初の目的",
        text: "認証卓にいるナイラへ話しかけ、巡察命令を受け取る。",
        icon: "巡",
        tone: "normal",
      });
    }

    continueGame() {
      try {
        const loaded = this.saveManager.load();
        if (!loaded) {
          this.bus.emit("ui:notify", { title: "セーブがない", text: "新しい巡察を始めてください。", icon: "!", tone: "warning" });
          return false;
        }
        this.loadState(loaded);
        return true;
      } catch (error) {
        this.bus.emit("ui:notify", { title: "ロード失敗", text: error.message, icon: "!", tone: "danger" });
        return false;
      }
    }

    loadState(state) {
      this.state = StateFactory.normalizeLoaded(state);
      this.state.mode = "exploration";
      this.state.paused = false;
      this.resetRuntimeForState();
      this.ui.enterExploration();
      this.world.enterMap(this.state.player.mapId, this.state.player.x, this.state.player.y, { force: true });
      this.bus.emit("ui:notify", { title: "巡察を再開", text: `${H.Core.Util.formatClock(this.state.world.day, this.state.world.segment)}から再開した。`, icon: "復", tone: "success" });
      return true;
    }

    resetRuntimeForState() {
      this.state.combat = null;
      this.state.dialogue = null;
      this.state.investigation = null;
      this.input.reset();
      this.interactions.refresh();
      this.world.recalculateWorldMetrics();
      this.audio.configure(this.state.settings);
      this.renderer.snapCamera();
      this.quests.evaluateAll();
      this.markDirty();
    }

    returnToTitle(resetFields = false) {
      if (this.state.mode !== "title") this.saveManager.autoSave(this.state, "return title");
      this.state.mode = "title";
      this.state.paused = true;
      this.state.combat = null;
      this.state.dialogue = null;
      this.state.investigation = null;
      this.ui.queuedStory = null;
      this.ui.closeDrawer(false);
      this.ui.dialoguePanel.close();
      this.ui.combatPanel.close();
      this.ui.reportPanel.close(false);
      H.UI.DOM.hide(document.getElementById("endingOverlay"));
      if (resetFields) document.getElementById("playerName").value = this.state.player.name || "レイ";
      this.ui.showTitle();
    }

    handleAction(action) {
      if (action === "debug") {
        this.state.ui.showDebug = !this.state.ui.showDebug;
        document.getElementById("debugOverlay").classList.toggle("is-hidden", !this.state.ui.showDebug);
        return;
      }
      if (action === "cancel") { this.ui.closeTop(); return; }
      if (this.state.mode === "exploration" && !this.ui.isModalOpen()) {
        if (action === "interact") this.interactions.interact();
        else if (["journal", "evidence", "deduction", "map", "people"].includes(action)) this.ui.openDrawer(action);
      }
    }

    frame(timestamp) {
      if (!this.running) return;
      const dt = Math.min(0.05, Math.max(0, (timestamp - this.lastFrame) / 1000));
      this.lastFrame = timestamp;
      this.update(dt);
      this.renderer.update(dt);
      this.combatRenderer.update(dt);
      this.input.endFrame();
      requestAnimationFrame((time) => this.frame(time));
    }

    update(dt) {
      if (this.state.mode === "exploration") {
        this.movement.update(dt);
        this.interactions.update(dt);
        if (!this.state.paused && !this.ui.isModalOpen()) {
          this.playtimeAccumulator += dt;
          if (this.playtimeAccumulator >= 1) {
            const seconds = Math.floor(this.playtimeAccumulator);
            this.state.meta.playtimeSeconds += seconds;
            this.playtimeAccumulator -= seconds;
          }
        }
      }
      this.ui.updateHUD();
      if (this.state.ui.showDebug) this.updateDebug();
    }

    updateDebug() {
      const map = this.world.currentMap;
      const p = this.state.player;
      const target = document.getElementById("debugOverlay");
      target.textContent = `${H.VERSION}\n${map.id} (${Math.round(p.x)}, ${Math.round(p.y)})\nmode=${this.state.mode} paused=${this.state.paused}\ninteract=${this.interactions.nearest?.id || "none"}\nevidence=${this.state.evidence.discovered.length} deductions=${this.state.deductions.solved.length}`;
    }

    addEvent(text, category = "system") {
      const history = this.state.world.eventHistory;
      history.push({ text, category, day: this.state.world.day, segment: this.state.world.segment, mapId: this.state.player.mapId });
      if (history.length > 220) history.shift();
      this.markDirty();
    }

    markDirty() { this.dirty = true; }

    exposeDebugAPI() {
      const game = this;
      window.haimachiGame = game;
      window.haimachiMCP = {
        getResourceSnapshot: () => game.mcp.getResourceSnapshot(),
        validateProposal: (proposal) => game.mcp.validateProposal(proposal),
        submitProposal: (proposal) => game.mcp.submitProposal(proposal),
        describeTools: () => game.mcp.describeTools(),
      };
      window.haimachiTransfer = {
        buildChapter1Transfer: () => game.transfer.build(),
        exportChapter2Transfer: () => game.transfer.exportChapter2Transfer(),
        getStoredChapter1Transfer: () => game.transfer.getStored(),
      };
    }
  }

  H.Runtime.Game = Game;
})(window.Haimachi);
