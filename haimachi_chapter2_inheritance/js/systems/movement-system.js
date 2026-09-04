(function registerMovementSystem(H) {
  "use strict";

  const { Util } = H.Core;

  class MovementSystem {
    constructor(game) {
      this.game = game;
      this.footstepTimer = 0;
    }

    update(dt) {
      const game = this.game;
      const state = game.state;
      if (!state || state.mode !== "exploration" || state.paused || game.ui?.isModalOpen()) {
        if (state?.player) state.player.moving = false;
        return;
      }
      const vector = game.input.getMovement();
      const player = state.player;
      player.moving = vector.active;
      if (!vector.active) return;

      const statBonus = 1 + Math.max(0, player.stats.observation - 1) * 0.015;
      const speed = player.speed * statBonus;
      const dx = vector.x * speed * dt;
      const dy = vector.y * speed * dt;
      this.tryMove(dx, 0);
      this.tryMove(0, dy);
      if (Math.abs(vector.x) > Math.abs(vector.y)) player.facing = vector.x < 0 ? "left" : "right";
      else player.facing = vector.y < 0 ? "up" : "down";

      this.footstepTimer -= dt;
      if (this.footstepTimer <= 0) {
        this.footstepTimer = 0.29;
        game.audio.footstep(game.world.currentMap.ambient?.surface || "stone");
      }
    }

    tryMove(dx, dy) {
      const state = this.game.state;
      const map = this.game.world.currentMap;
      const player = state.player;
      const nextX = Util.clamp(player.x + dx, player.radius, map.width - player.radius);
      const nextY = Util.clamp(player.y + dy, player.radius, map.height - player.radius);
      if (!this.collides(nextX, nextY, player.radius, map.obstacles || [])) {
        player.x = nextX;
        player.y = nextY;
      }
    }

    collides(x, y, radius, obstacles) {
      for (const obstacle of obstacles) {
        if (obstacle.passable) continue;
        if (Util.circleRectOverlap(x, y, radius, obstacle)) return true;
      }
      return false;
    }
  }

  H.Systems.MovementSystem = MovementSystem;
})(window.Haimachi);
