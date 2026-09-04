(function registerConditions(H) {
  "use strict";

  const { Util } = H.Core;

  class ConditionEvaluator {
    constructor(dataProvider = () => H.Data) {
      this.dataProvider = dataProvider;
    }

    all(conditions, state, context = {}) {
      return Util.ensureArray(conditions).every((condition) => this.test(condition, state, context));
    }

    any(conditions, state, context = {}) {
      return Util.ensureArray(conditions).some((condition) => this.test(condition, state, context));
    }

    test(condition, state, context = {}) {
      if (condition == null) return true;
      if (typeof condition === "boolean") return condition;
      if (typeof condition === "function") return Boolean(condition(state, context, this.dataProvider()));
      if (Array.isArray(condition)) return this.all(condition, state, context);

      if (condition.all) return this.all(condition.all, state, context);
      if (condition.any) return this.any(condition.any, state, context);
      if (condition.not) return !this.test(condition.not, state, context);

      const type = condition.type;
      const id = condition.id;
      const op = condition.op || "eq";
      const value = condition.value ?? true;

      switch (type) {
        case "flag":
          return Util.compare(Boolean(state.world.flags[id]), op, value);
        case "evidence":
          return Util.compare(state.evidence.discovered.includes(id), op, value);
        case "evidenceCount":
          return Util.compare(state.evidence.discovered.length, op, condition.value);
        case "deduction":
          return Util.compare(state.deductions.solved.includes(id), op, value);
        case "deductionCount":
          return Util.compare(state.deductions.solved.length, op, condition.value);
        case "item": {
          const count = state.player.inventory[id] || 0;
          return Util.compare(count, op, condition.value ?? 1);
        }
        case "quest": {
          const quest = state.quests[id];
          const actual = condition.field ? Util.getByPath(quest, condition.field) : quest?.status;
          return Util.compare(actual, op, condition.value);
        }
        case "trust": {
          const trust = state.npcs[id]?.trust ?? 0;
          return Util.compare(trust, op, condition.value);
        }
        case "npcState": {
          const actual = Util.getByPath(state.npcs[id], condition.path || "state");
          return Util.compare(actual, op, condition.value);
        }
        case "stat": {
          const actual = state.player.stats[id] || 0;
          return Util.compare(actual, op, condition.value);
        }
        case "player": {
          const actual = Util.getByPath(state.player, condition.path || id);
          return Util.compare(actual, op, condition.value);
        }
        case "world": {
          const actual = Util.getByPath(state.world, condition.path || id);
          return Util.compare(actual, op, condition.value);
        }
        case "district": {
          const actual = Util.getByPath(state.world.districts[id], condition.path);
          return Util.compare(actual, op, condition.value);
        }
        case "rumor": {
          const actual = Util.getByPath(state.world.rumors[id], condition.path || "intensity");
          return Util.compare(actual, op, condition.value);
        }
        case "mapUnlocked":
          return Util.compare(state.world.unlockedMaps.includes(id), op, value);
        case "hotspotUsed":
          return Util.compare(Boolean(state.world.usedHotspots[id]), op, value);
        case "encounterCleared":
          return Util.compare(state.world.clearedEncounters.includes(id), op, value);
        case "dialogueSeen":
          return Util.compare(Boolean(state.npcs[context.npcId || condition.npcId]?.topicsSeen?.[id]), op, value);
        case "difficulty":
          return Util.compare(state.settings.difficulty, op, condition.value || id);
        case "context": {
          const actual = Util.getByPath(context, condition.path || id);
          return Util.compare(actual, op, condition.value);
        }
        default:
          console.warn("Unknown condition type", condition);
          return false;
      }
    }
  }

  H.Core.ConditionEvaluator = ConditionEvaluator;
})(window.Haimachi);
