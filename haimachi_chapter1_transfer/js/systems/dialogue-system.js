(function registerDialogueSystem(H) {
  "use strict";

  const { ConditionEvaluator, Util } = H.Core;

  class DialogueSystem {
    constructor(game) {
      this.game = game;
      this.conditions = new ConditionEvaluator();
    }

    open(npcId) {
      const npc = H.Data.NPCById[npcId];
      const script = H.Data.Dialogues[npcId];
      const npcState = this.game.state.npcs[npcId];
      if (!npc || !script || !npcState || npcState.state === "hidden") return false;
      const greeting = this.pickGreeting(script.greetings || [], npcId);
      this.game.state.dialogue = { npcId, topicId: null, text: greeting || "……" };
      this.game.state.paused = true;
      npcState.lastSpokenDay = this.game.state.world.day;
      this.game.bus.emit("dialogue:open", { npc, npcState, text: greeting, topics: this.getTopics(npcId) });
      return true;
    }

    pickGreeting(greetings, npcId) {
      return (greetings.find((entry) => this.conditions.test(entry.requires, this.game.state, { npcId })) || greetings.find((entry) => !entry.requires) || greetings[0])?.text || "……";
    }

    getTopics(npcId) {
      const script = H.Data.Dialogues[npcId];
      if (!script) return [];
      return (script.topics || []).filter((topic) => {
        if (topic.hideWhen && this.conditions.test(topic.hideWhen, this.game.state, { npcId })) return false;
        return this.conditions.test(topic.requires, this.game.state, { npcId });
      }).map((topic) => ({
        ...topic,
        options: (topic.options || []).filter((option) => {
          const marker = `${topic.id}:${option.id}`;
          if (option.once && this.game.state.npcs[npcId].choicesMade[marker]) return false;
          if (option.hideWhen && this.conditions.test(option.hideWhen, this.game.state, { npcId, topicId: topic.id })) return false;
          return this.conditions.test(option.requires, this.game.state, { npcId, topicId: topic.id });
        }),
      })).filter((topic) => topic.options.length > 0);
    }

    choose(npcId, topicId, optionId) {
      if (this.game.state.dialogue?.npcId !== npcId) return false;
      const script = H.Data.Dialogues[npcId];
      const topic = script?.topics?.find((entry) => entry.id === topicId);
      const option = topic?.options?.find((entry) => entry.id === optionId);
      if (!topic || !option) return false;
      const marker = `${topic.id}:${option.id}`;
      if (option.once && this.game.state.npcs[npcId].choicesMade[marker]) return false;
      if (!this.conditions.test(option.requires, this.game.state, { npcId, topicId })) return false;

      const npcState = this.game.state.npcs[npcId];
      npcState.topicsSeen[topicId] = true;
      npcState.choicesMade[marker] = true;
      if (option.marker) npcState.topicsSeen[option.marker] = true;
      npcState.memory.push({
        topicId,
        optionId,
        marker: option.marker || null,
        day: this.game.state.world.day,
        segment: this.game.state.world.segment,
      });
      if (npcState.memory.length > 80) npcState.memory.shift();
      this.game.effects.apply(option.effects, { npcId, topicId, optionId, reason: `会話：${H.Data.NPCById[npcId].shortName}` });
      if (option.timeCost) this.game.time.advance(option.timeCost, `会話：${H.Data.NPCById[npcId].shortName}`);
      this.game.state.dialogue.topicId = topicId;
      this.game.state.dialogue.text = option.response;
      this.game.audio.dialogue();
      this.game.addEvent(`${H.Data.NPCById[npcId].shortName}から「${topic.label}」について聞いた。`, "dialogue");
      this.game.quests.evaluateAll();
      this.game.bus.emit("dialogue:update", {
        npc: H.Data.NPCById[npcId],
        npcState,
        text: option.response,
        topics: this.getTopics(npcId),
        chosen: { topic, option },
      });
      this.game.saveManager.scheduleAutoSave(this.game.state);
      return true;
    }

    close() {
      this.game.state.dialogue = null;
      this.game.state.paused = false;
      this.game.bus.emit("dialogue:close", {});
      return true;
    }
  }

  H.Systems.DialogueSystem = DialogueSystem;
})(window.Haimachi);
