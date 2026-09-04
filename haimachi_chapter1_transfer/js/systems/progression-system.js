(function registerProgressionSystem(H) {
  "use strict";

  const { Util } = H.Core;

  class ProgressionSystem {
    constructor(game) {
      this.game = game;
    }

    addXP(amount, reason = "調査成果") {
      if (!Number.isFinite(amount) || amount <= 0) return this.game.state.player.xp;
      const player = this.game.state.player;
      player.xp += Math.round(amount);
      this.game.bus.emit("progression:xp", { amount: Math.round(amount), reason, total: player.xp });
      const thresholds = H.Data.Config.progression.xpThresholds;
      let targetLevel = player.level;
      for (let level = 1; level < thresholds.length; level += 1) {
        if (player.xp >= thresholds[level]) targetLevel = level + 1;
      }
      if (targetLevel > player.level) {
        player.pendingLevelUps += targetLevel - player.level;
        player.level = targetLevel;
        player.rank = H.Data.Config.progression.ranks[Math.min(player.level - 1, H.Data.Config.progression.ranks.length - 1)];
        this.game.bus.emit("progression:level", { level: player.level, rank: player.rank, pending: player.pendingLevelUps });
      }
      return player.xp;
    }

    chooseStat(statId) {
      const player = this.game.state.player;
      if (player.pendingLevelUps <= 0 || !Object.prototype.hasOwnProperty.call(player.stats, statId)) return false;
      player.stats[statId] = Util.clamp(player.stats[statId] + 1, 1, 6);
      player.pendingLevelUps -= 1;
      if (statId === "empathy") {
        player.maxComposure += 8;
        player.composure = player.maxComposure;
      }
      this.game.bus.emit("progression:statChosen", { statId, value: player.stats[statId], pending: player.pendingLevelUps });
      this.game.saveManager.scheduleAutoSave(this.game.state);
      return true;
    }

    nextThreshold() {
      const player = this.game.state.player;
      return H.Data.Config.progression.xpThresholds[player.level] ?? null;
    }
  }

  H.Systems.ProgressionSystem = ProgressionSystem;
})(window.Haimachi);
