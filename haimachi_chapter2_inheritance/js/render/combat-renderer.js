(function registerCombatRenderer(H) {
  "use strict";

  class CombatRenderer {
    constructor(game, canvas) {
      this.game = game;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.elapsed = 0;
      this.shards = [];
      this.lastSnapshot = null;
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
      this.resetParticles();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      this.width = Math.max(300, rect.width || 900);
      this.height = Math.max(180, rect.height || 320);
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    resetParticles() {
      this.shards = Array.from({ length: 70 }, (_, i) => ({
        angle: i * 2.399,
        radius: 35 + (i % 13) * 8,
        size: 2 + (i % 5),
        speed: 0.12 + (i % 7) * .025,
        phase: i * .7,
      }));
    }

    update(dt) {
      this.elapsed += dt;
      let snapshot = this.game.combat?.snapshot();
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);
      if (snapshot) this.lastSnapshot = snapshot;
      else if (this.game.ui?.combatPanel?.finished && this.lastSnapshot) snapshot = this.lastSnapshot;
      else { this.lastSnapshot = null; return; }
      const { enemy, integrity, maxIntegrity, phaseIndex, panic } = snapshot;
      const ratio = Math.max(0, integrity / maxIntegrity);
      const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, "#171d20"); gradient.addColorStop(1, "#090c0f");
      ctx.fillStyle = gradient; ctx.fillRect(0, 0, this.width, this.height);
      this.drawGrid(panic);
      const cx = this.width / 2, cy = this.height * .5;
      const pulse = 1 + Math.sin(this.elapsed * (2.4 + phaseIndex)) * .055;
      const baseRadius = Math.min(this.height * .31, 96) * pulse * (.72 + ratio * .28);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(Math.sin(this.elapsed * .47) * .04);
      ctx.shadowColor = enemy.glow;
      ctx.shadowBlur = 35 + panic * .25;
      ctx.fillStyle = `${enemy.color}dd`;
      ctx.beginPath();
      const points = 12;
      for (let i = 0; i < points; i += 1) {
        const a = (Math.PI * 2 * i) / points;
        const jag = 1 + Math.sin(i * 5.7 + this.elapsed * 2.1) * .13 + (i % 3) * .05;
        const r = baseRadius * jag;
        const x = Math.cos(a) * r, y = Math.sin(a) * r * .82;
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.closePath(); ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = enemy.glow; ctx.lineWidth = 2.5; ctx.stroke();
      ctx.fillStyle = "rgba(15,16,17,.75)"; ctx.beginPath(); ctx.ellipse(0, 4, baseRadius*.62, baseRadius*.43, 0, 0, Math.PI*2); ctx.fill();
      ctx.fillStyle = enemy.glow; ctx.font = `900 ${Math.max(34, baseRadius*.48)}px serif`; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(enemy.glyph, 0, 3);
      ctx.restore();

      for (const shard of this.shards) {
        const angle = shard.angle + this.elapsed * shard.speed * (phaseIndex + 1);
        const r = shard.radius + Math.sin(this.elapsed * 1.4 + shard.phase) * 16;
        const x = cx + Math.cos(angle) * r * 1.8;
        const y = cy + Math.sin(angle) * r * .9;
        ctx.globalAlpha = .18 + ratio * .48;
        ctx.fillStyle = enemy.glow;
        ctx.fillRect(x, y, shard.size, shard.size * 2.2);
      }
      ctx.globalAlpha = 1;
      if (ratio < .35) {
        ctx.strokeStyle = "rgba(240,203,146,.35)"; ctx.lineWidth = 2;
        for (let i = 0; i < 7; i += 1) {
          const y = (i + 1) * this.height / 8 + Math.sin(this.elapsed * 3 + i) * 4;
          ctx.beginPath(); ctx.moveTo(cx - baseRadius*1.3, y); ctx.lineTo(cx + baseRadius*1.3, y + (i%2?8:-8)); ctx.stroke();
        }
      }
    }

    drawGrid(panic) {
      const ctx = this.ctx;
      ctx.strokeStyle = `rgba(124,151,153,${.04 + panic/1500})`;
      ctx.lineWidth = 1;
      for (let x = 0; x < this.width; x += 48) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,this.height); ctx.stroke(); }
      for (let y = 0; y < this.height; y += 38) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(this.width,y); ctx.stroke(); }
    }

    destroy() { window.removeEventListener("resize", this.resize); }
  }

  H.Render.CombatRenderer = CombatRenderer;
})(window.Haimachi);
