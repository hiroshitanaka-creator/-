(function registerQuestSystem(H) {
  "use strict";

  const { ConditionEvaluator } = H.Core;

  class QuestSystem {
    constructor(game) {
      this.game = game;
      this.conditions = new ConditionEvaluator();
      this.evaluating = false;
    }

    start(id) {
      const quest = H.Data.QuestById[id];
      const state = this.game.state.quests[id];
      if (!quest || !state || state.status === "active" || state.status === "complete") return false;
      state.status = "active";
      state.currentStage = 0;
      state.startedAt = { day: this.game.state.world.day, segment: this.game.state.world.segment };
      this.game.bus.emit("quest:started", { quest, state });
      this.game.bus.emit("ui:notify", { title: "追加巡察を開始", text: `${quest.title} — ${quest.summary}`, icon: "記", tone: "normal" });
      return true;
    }

    complete(id) {
      const quest = H.Data.QuestById[id];
      const state = this.game.state.quests[id];
      if (!quest || !state || state.status === "complete") return false;
      state.status = "complete";
      state.completedAt = { day: this.game.state.world.day, segment: this.game.state.world.segment };
      this.game.bus.emit("quest:completed", { quest, state });
      this.game.bus.emit("ui:notify", { title: "巡察記録を完了", text: `${quest.title}${quest.rewardsText ? ` — ${quest.rewardsText}` : ""}`, icon: "✓", tone: "success" });
      return true;
    }

    fail(id) {
      const quest = H.Data.QuestById[id];
      const state = this.game.state.quests[id];
      if (!quest || !state || ["complete", "failed"].includes(state.status)) return false;
      state.status = "failed";
      state.failedAt = { day: this.game.state.world.day, segment: this.game.state.world.segment };
      this.game.bus.emit("quest:failed", { quest, state });
      return true;
    }

    evaluateAll() {
      if (this.evaluating) return false;
      this.evaluating = true;
      try {
        for (const quest of H.Data.Quests || []) this.evaluateQuest(quest.id);
      } finally {
        this.evaluating = false;
      }
      return true;
    }

    evaluateQuest(id) {
      const quest = H.Data.QuestById[id];
      const qState = this.game.state.quests[id];
      if (!quest || !qState || qState.status !== "active") return false;
      let guard = 0;
      while (qState.status === "active" && guard < 12) {
        guard += 1;
        const stage = quest.stages[qState.currentStage];
        if (!stage) {
          this.complete(id);
          break;
        }
        qState.completedObjectives = (stage.objectives || [])
          .filter((objective) => this.conditions.test(objective.condition, this.game.state, { questId: id, stage: qState.currentStage }))
          .map((objective) => objective.id);
        const required = (stage.objectives || []).filter((objective) => !objective.optional);
        const complete = required.every((objective) => qState.completedObjectives.includes(objective.id));
        if (!complete) break;

        const completedStage = qState.currentStage;
        qState.currentStage += 1;
        this.game.effects.apply(stage.onCompleteEffects, { questId: id, stage: completedStage, reason: `任務段階：${stage.title}` });
        this.game.addEvent(`任務段階完了「${quest.title}：${stage.title}」`, "quest");
        this.game.bus.emit("quest:stageCompleted", { quest, stage, stageIndex: completedStage, state: qState });
        if (qState.currentStage >= quest.stages.length) {
          this.complete(id);
          break;
        }
      }
      return true;
    }

    trackedObjective() {
      const states = this.game.state.quests;
      const active = (H.Data.Quests || []).filter((quest) => states[quest.id]?.status === "active");
      const tracked = active.find((quest) => states[quest.id].tracked) || active.find((quest) => quest.type === "main") || active[0];
      if (!tracked) return { title: "街を巡察する", quest: null, stage: null };
      const qState = states[tracked.id];
      const stage = tracked.stages[qState.currentStage];
      const next = stage?.objectives?.find((objective) => !qState.completedObjectives.includes(objective.id) && !objective.optional)
        || stage?.objectives?.find((objective) => !qState.completedObjectives.includes(objective.id));
      return { title: next?.text || stage?.description || tracked.summary, quest: tracked, stage };
    }
  }

  H.Systems.QuestSystem = QuestSystem;
})(window.Haimachi);
