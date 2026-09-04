(function registerCanvasRenderer(H) {
  "use strict";

  const { Util } = H.Core;

  class CanvasRenderer {
    constructor(game, canvas) {
      this.game = game;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
      this.width = 1280;
      this.height = 720;
      this.camera = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.elapsed = 0;
      this.rain = [];
      this.fog = [];
      this.lastMapId = null;
      this.resize = this.resize.bind(this);
      window.addEventListener("resize", this.resize);
      this.resize();
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(320, rect.width || window.innerWidth);
      this.height = Math.max(240, rect.height || window.innerHeight);
      this.dpr = Math.min(2, window.devicePixelRatio || 1);
      this.canvas.width = Math.floor(this.width * this.dpr);
      this.canvas.height = Math.floor(this.height * this.dpr);
      this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      this.initWeatherParticles();
      this.snapCamera();
    }

    initWeatherParticles() {
      this.rain = Array.from({ length: Math.max(50, Math.floor(this.width / 12)) }, (_, index) => ({
        x: (index * 83.7) % this.width,
        y: (index * 137.9) % this.height,
        speed: 530 + (index % 9) * 38,
        length: 10 + (index % 6) * 3,
        alpha: 0.16 + (index % 5) * 0.035,
      }));
      this.fog = Array.from({ length: 14 }, (_, index) => ({
        x: (index * 241) % (this.width + 260) - 130,
        y: (index * 97) % this.height,
        radius: 90 + (index % 5) * 45,
        speed: 5 + (index % 4) * 2,
        alpha: 0.018 + (index % 3) * 0.009,
      }));
    }

    snapCamera() {
      const player = this.game.state?.player;
      const map = this.game.world?.currentMap;
      if (!player || !map) return;
      this.camera.x = this.camera.targetX = Util.clamp(player.x - this.width / 2, 0, Math.max(0, map.width - this.width));
      this.camera.y = this.camera.targetY = Util.clamp(player.y - this.height / 2, 0, Math.max(0, map.height - this.height));
    }

    update(dt) {
      this.elapsed += dt;
      const state = this.game.state;
      const map = this.game.world?.currentMap;
      if (!state || !map) {
        this.drawTitleBackdrop();
        return;
      }
      if (this.lastMapId !== map.id) {
        this.lastMapId = map.id;
        this.snapCamera();
      }
      this.camera.targetX = Util.clamp(state.player.x - this.width / 2, 0, Math.max(0, map.width - this.width));
      this.camera.targetY = Util.clamp(state.player.y - this.height / 2, 0, Math.max(0, map.height - this.height));
      const smooth = 1 - Math.pow(0.0008, dt);
      this.camera.x = Util.lerp(this.camera.x, this.camera.targetX, smooth);
      this.camera.y = Util.lerp(this.camera.y, this.camera.targetY, smooth);
      this.drawWorld(map, state, dt);
    }

    drawTitleBackdrop() {
      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, "#1a2228");
      gradient.addColorStop(1, "#0c1014");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.strokeStyle = "rgba(159,180,183,.08)";
      ctx.lineWidth = 1;
      for (let x = -this.height; x < this.width + this.height; x += 72) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + this.height, this.height); ctx.stroke();
      }
      this.drawWeather({ ambient: { rain: 0.7, fog: 0.24 } }, 1 / 60);
    }

    drawWorld(map, state, dt) {
      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.width, this.height);
      const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
      gradient.addColorStop(0, map.colors.ground);
      gradient.addColorStop(1, this.shade(map.colors.ground, -18));
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.width, this.height);

      ctx.save();
      ctx.translate(-this.camera.x, -this.camera.y);
      this.drawMapBase(map);
      this.drawSurfaces(map);
      this.drawDecorations(map);
      this.drawObstacles(map);
      this.drawInteractables(map, state);
      this.drawNPCs(map, state);
      this.drawPlayer(state.player);
      if (state.ui.showDebug) this.drawDebug(map);
      ctx.restore();

      this.drawLighting(map, state);
      this.drawWeather(map, dt);
      this.drawEdgeMood(state, map);
    }

    drawMapBase(map) {
      const ctx = this.ctx;
      ctx.fillStyle = map.colors.ground;
      ctx.fillRect(0, 0, map.width, map.height);
      ctx.strokeStyle = "rgba(255,255,255,.025)";
      ctx.lineWidth = 1;
      const step = 64;
      for (let x = 0; x <= map.width; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, map.height); ctx.stroke(); }
      for (let y = 0; y <= map.height; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(map.width, y); ctx.stroke(); }
      for (let i = 0; i < 90; i += 1) {
        const x = (i * 157 + map.width * 0.13) % map.width;
        const y = (i * 283 + map.height * 0.21) % map.height;
        ctx.strokeStyle = `rgba(10,14,16,${0.06 + (i % 4) * 0.015})`;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + 18 + (i % 6) * 6, y + ((i % 3) - 1) * 12);
        ctx.stroke();
      }
    }

    drawSurfaces(map) {
      const ctx = this.ctx;
      const colors = {
        road: map.colors.road,
        stone: map.colors.road,
        plaza: this.shade(map.colors.road, 10),
        wood: "#4f514b",
        runner: "#653f35",
        paper: "#8c8977",
        water: "#293f49",
        waterChannel: "#233943",
        mud: "#4a4439",
        ash: "#4d4e4b",
        dock: "#55493b",
      };
      for (const surface of map.surfaces || []) {
        ctx.fillStyle = colors[surface.type] || map.colors.road;
        ctx.fillRect(surface.x, surface.y, surface.w, surface.h);
        ctx.strokeStyle = "rgba(15,18,18,.18)";
        ctx.strokeRect(surface.x + 0.5, surface.y + 0.5, surface.w - 1, surface.h - 1);
        if (["road", "stone", "plaza"].includes(surface.type)) this.drawPaving(surface);
        if (["water", "waterChannel"].includes(surface.type)) this.drawWater(surface);
        if (surface.type === "wood" || surface.type === "dock") this.drawBoards(surface);
      }
    }

    drawPaving(rect) {
      const ctx = this.ctx;
      ctx.save(); ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
      ctx.strokeStyle = "rgba(25,28,26,.12)"; ctx.lineWidth = 1;
      for (let y = rect.y; y < rect.y + rect.h; y += 38) {
        const offset = ((y / 38) % 2) * 31;
        for (let x = rect.x - offset; x < rect.x + rect.w; x += 62) ctx.strokeRect(x, y, 60, 36);
      }
      ctx.restore();
    }

    drawBoards(rect) {
      const ctx = this.ctx;
      ctx.save(); ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
      ctx.strokeStyle = "rgba(20,15,10,.22)";
      for (let y = rect.y; y < rect.y + rect.h; y += 28) { ctx.beginPath(); ctx.moveTo(rect.x, y); ctx.lineTo(rect.x + rect.w, y); ctx.stroke(); }
      ctx.restore();
    }

    drawWater(rect) {
      const ctx = this.ctx;
      ctx.save(); ctx.beginPath(); ctx.rect(rect.x, rect.y, rect.w, rect.h); ctx.clip();
      ctx.strokeStyle = "rgba(160,190,194,.17)"; ctx.lineWidth = 2;
      for (let y = rect.y + 12; y < rect.y + rect.h; y += 24) {
        ctx.beginPath();
        for (let x = rect.x - 20; x < rect.x + rect.w + 20; x += 10) {
          const yy = y + Math.sin(x * 0.035 + this.elapsed * 1.3) * 3;
          if (x === rect.x - 20) ctx.moveTo(x, yy); else ctx.lineTo(x, yy);
        }
        ctx.stroke();
      }
      ctx.restore();
    }

    drawObstacles(map) {
      const ctx = this.ctx;
      for (const obstacle of map.obstacles || []) {
        const palette = {
          wall: map.colors.wall,
          building: map.colors.wall,
          shelf: "#3d3429",
          table: "#4d4234",
          desk: "#504334",
          stall: "#5b4435",
          fountain: "#333d40",
          crates: "#534434",
          grate: "#252d30",
          sealDoor: "#2d3234",
          pipes: "#353b3c",
          weaponRack: "#413a32",
        };
        const base = palette[obstacle.kind] || map.colors.wall;
        ctx.fillStyle = "rgba(0,0,0,.25)";
        ctx.fillRect(obstacle.x + 8, obstacle.y + 10, obstacle.w, obstacle.h);
        const grad = ctx.createLinearGradient(obstacle.x, obstacle.y, obstacle.x, obstacle.y + obstacle.h);
        grad.addColorStop(0, this.shade(base, 13)); grad.addColorStop(1, this.shade(base, -10));
        ctx.fillStyle = grad;
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
        ctx.strokeStyle = "rgba(202,177,112,.18)";
        ctx.lineWidth = 2;
        ctx.strokeRect(obstacle.x + 1, obstacle.y + 1, obstacle.w - 2, obstacle.h - 2);
        if (obstacle.kind === "shelf") this.drawShelf(obstacle);
        if (obstacle.kind === "crates") this.drawCrates(obstacle);
        if (obstacle.kind === "pipes") this.drawPipes(obstacle);
        if (obstacle.label && obstacle.w > 90 && obstacle.h > 54) {
          ctx.fillStyle = "rgba(225,218,194,.55)";
          ctx.font = "600 12px system-ui";
          ctx.textAlign = "center";
          ctx.fillText(obstacle.label, obstacle.x + obstacle.w / 2, obstacle.y + Math.min(24, obstacle.h / 2));
        }
      }
    }

    drawShelf(rect) {
      const ctx = this.ctx;
      for (let y = rect.y + 24; y < rect.y + rect.h; y += 46) {
        ctx.fillStyle = "rgba(15,12,9,.35)"; ctx.fillRect(rect.x + 8, y, rect.w - 16, 5);
        for (let x = rect.x + 14; x < rect.x + rect.w - 12; x += 18) {
          const h = 18 + ((x + y) % 17);
          ctx.fillStyle = ["#73684c", "#745047", "#4e6668", "#8a7957"][(x / 18 + y / 46) % 4 | 0];
          ctx.fillRect(x, y - h, 12, h);
        }
      }
    }

    drawCrates(rect) {
      const ctx = this.ctx;
      const size = 48;
      for (let y = rect.y + 4; y < rect.y + rect.h - 10; y += size) {
        for (let x = rect.x + 4; x < rect.x + rect.w - 10; x += size) {
          ctx.strokeStyle = "rgba(20,12,8,.35)"; ctx.strokeRect(x, y, size - 6, size - 6);
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + size - 6, y + size - 6); ctx.stroke();
        }
      }
    }

    drawPipes(rect) {
      const ctx = this.ctx;
      ctx.strokeStyle = "#687274"; ctx.lineWidth = 12;
      for (let y = rect.y + 24; y < rect.y + rect.h; y += 42) { ctx.beginPath(); ctx.moveTo(rect.x + 8, y); ctx.lineTo(rect.x + rect.w - 8, y); ctx.stroke(); }
    }

    drawDecorations(map) {
      const ctx = this.ctx;
      for (const deco of map.decorations || []) {
        switch (deco.type) {
          case "lamp": this.drawLamp(deco); break;
          case "clock": this.drawClock(deco); break;
          case "banner": this.drawBanner(deco); break;
          case "crowd": this.drawCrowd(deco); break;
          case "rug": this.drawRug(deco); break;
          case "mapTable": this.drawMapTable(deco); break;
          case "paperStack": this.drawPaperStack(deco); break;
          case "boat": this.drawBoat(deco); break;
          case "bell": this.drawBell(deco); break;
          case "crystal": this.drawCrystal(deco); break;
          case "posterWall": this.drawPosterWall(deco); break;
          default: this.drawSimpleDecoration(deco); break;
        }
      }
    }

    drawLamp(deco) {
      const ctx = this.ctx;
      ctx.fillStyle = "#25292a"; ctx.fillRect(deco.x - 3, deco.y - 8, 6, 44);
      ctx.shadowColor = "rgba(230,183,84,.95)"; ctx.shadowBlur = 22;
      ctx.fillStyle = "#e7bd62"; ctx.beginPath(); ctx.arc(deco.x, deco.y - 13, 7, 0, Math.PI * 2); ctx.fill();
      ctx.shadowBlur = 0;
    }

    drawClock(deco) {
      const ctx = this.ctx;
      ctx.fillStyle = "rgba(25,31,32,.75)"; ctx.beginPath(); ctx.arc(deco.x, deco.y, deco.radius || 90, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#a98b4c"; ctx.lineWidth = 8; ctx.stroke();
      ctx.strokeStyle = "rgba(224,211,175,.8)"; ctx.lineWidth = 3;
      const angle = this.game.state.world.segment * Math.PI / 2 - Math.PI / 2;
      ctx.beginPath(); ctx.moveTo(deco.x, deco.y); ctx.lineTo(deco.x + Math.cos(angle) * deco.radius * .58, deco.y + Math.sin(angle) * deco.radius * .58); ctx.stroke();
    }

    drawBanner(deco) {
      const ctx = this.ctx;
      const w = Math.max(180, (deco.text?.length || 10) * 15);
      ctx.fillStyle = "rgba(61,48,37,.8)"; ctx.fillRect(deco.x - w / 2, deco.y - 17, w, 34);
      ctx.strokeStyle = "rgba(201,170,102,.45)"; ctx.strokeRect(deco.x - w / 2, deco.y - 17, w, 34);
      ctx.fillStyle = "rgba(233,223,198,.75)"; ctx.font = "600 13px serif"; ctx.textAlign = "center"; ctx.fillText(deco.text || "灰街", deco.x, deco.y + 5);
    }

    drawCrowd(deco) {
      const ctx = this.ctx;
      for (let i = 0; i < (deco.count || 5); i += 1) {
        const angle = i * 2.399;
        const r = 14 + (i % 3) * 16;
        const x = deco.x + Math.cos(angle) * r;
        const y = deco.y + Math.sin(angle) * r;
        ctx.fillStyle = ["#394248", "#53423c", "#3d4e49", "#4c4655"][i % 4];
        ctx.beginPath(); ctx.arc(x, y, 10, 0, Math.PI * 2); ctx.fill();
        ctx.fillRect(x - 8, y + 8, 16, 21);
      }
    }

    drawRug(deco) { const c=this.ctx;c.fillStyle="rgba(91,52,43,.68)";c.fillRect(deco.x,deco.y,deco.w,deco.h);c.strokeStyle="rgba(212,176,99,.45)";c.lineWidth=5;c.strokeRect(deco.x+6,deco.y+6,deco.w-12,deco.h-12); }
    drawMapTable(deco) { const c=this.ctx;c.fillStyle="#756e5c";c.fillRect(deco.x-deco.w/2,deco.y-deco.h/2,deco.w,deco.h);c.strokeStyle="#b1a37c";for(let i=0;i<5;i++){c.beginPath();c.moveTo(deco.x-deco.w/2+20,deco.y-deco.h/2+14+i*14);c.lineTo(deco.x+deco.w/2-20,deco.y-deco.h/2+10+i*15);c.stroke();} }
    drawPaperStack(deco) { const c=this.ctx;for(let i=0;i<(deco.count||4);i++){c.fillStyle=i%2?"#aaa38d":"#c1b79b";c.fillRect(deco.x+i*2,deco.y-i*3,42,30);c.strokeStyle="rgba(55,48,36,.3)";c.strokeRect(deco.x+i*2,deco.y-i*3,42,30);} }
    drawBoat(deco) { const c=this.ctx;c.fillStyle="#4f3b2f";c.beginPath();c.ellipse(deco.x,deco.y,deco.w/2,deco.h/2,0,0,Math.PI*2);c.fill();c.fillStyle="#26343a";c.beginPath();c.ellipse(deco.x,deco.y,deco.w*.34,deco.h*.23,0,0,Math.PI*2);c.fill(); }
    drawBell(deco) { const c=this.ctx;c.fillStyle="#927844";c.beginPath();c.arc(deco.x,deco.y,deco.radius||42,Math.PI,0);c.lineTo(deco.x+(deco.radius||42),deco.y+34);c.lineTo(deco.x-(deco.radius||42),deco.y+34);c.closePath();c.fill();c.strokeStyle="#d2b66f";c.stroke(); }
    drawCrystal(deco) { const c=this.ctx;c.save();c.translate(deco.x,deco.y);c.shadowColor="#aebbc0";c.shadowBlur=14;c.fillStyle="rgba(159,173,177,.55)";const r=deco.radius||28;c.beginPath();c.moveTo(0,-r);c.lineTo(r*.7,-r*.15);c.lineTo(r*.35,r);c.lineTo(-r*.5,r*.65);c.lineTo(-r*.65,-r*.25);c.closePath();c.fill();c.restore(); }
    drawPosterWall(deco) { const c=this.ctx;for(let i=0;i<(deco.count||5);i++){const x=deco.x+(i%3)*36;const y=deco.y+Math.floor(i/3)*46;c.fillStyle=i%2?"#b5a47f":"#968e75";c.fillRect(x,y,30,42);c.fillStyle="#6e3d32";c.fillRect(x+6,y+7,18,4);c.fillRect(x+6,y+15,14,2);} }
    drawSimpleDecoration(deco) { const c=this.ctx;c.fillStyle="rgba(191,176,136,.25)";c.beginPath();c.arc(deco.x,deco.y,deco.radius||12,0,Math.PI*2);c.fill(); }

    drawInteractables(map, state) {
      const ctx = this.ctx;
      const nearest = this.game.interactions?.nearest;
      for (const item of this.game.interactions?.items || []) {
        if (item.type === "npc") continue;
        const selected = nearest?.id === item.id && nearest?.type === item.type;
        const pulse = 1 + Math.sin(this.elapsed * 3.6) * 0.08;
        const radius = Math.min(54, (item.radius || 60) * 0.45) * pulse;
        ctx.save();
        ctx.globalAlpha = item.available === false ? 0.26 : selected ? 0.95 : 0.38;
        ctx.strokeStyle = item.type === "encounter" ? "#d2725e" : item.type === "exit" ? "#7fa8a5" : "#c5a35d";
        ctx.lineWidth = selected ? 4 : 2;
        ctx.setLineDash(item.type === "hotspot" ? [5, 5] : []);
        ctx.beginPath(); ctx.arc(item.x, item.y, radius, 0, Math.PI * 2); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = item.type === "encounter" ? "rgba(194,80,59,.22)" : "rgba(201,167,92,.12)";
        ctx.beginPath(); ctx.arc(item.x, item.y, radius * .7, 0, Math.PI * 2); ctx.fill();
        if (selected) {
          ctx.fillStyle = "rgba(239,226,188,.94)"; ctx.font = "700 12px system-ui"; ctx.textAlign = "center";
          ctx.fillText(item.type === "exit" ? "移" : item.type === "encounter" ? "噂" : "調", item.x, item.y + 4);
        }
        ctx.restore();
      }
    }

    drawNPCs(map, state) {
      const ctx = this.ctx;
      const nearest = this.game.interactions?.nearest;
      for (const npcData of H.Data.NPCs || []) {
        const npc = state.npcs[npcData.id];
        if (!npc || npc.mapId !== map.id || npc.state === "hidden") continue;
        const selected = nearest?.type === "npc" && nearest.id === npcData.id;
        const bob = Math.sin(this.elapsed * 2.1 + npc.x * .01) * 1.5;
        ctx.save(); ctx.translate(npc.x, npc.y + bob);
        if (selected) {
          ctx.strokeStyle = "rgba(225,187,101,.9)"; ctx.lineWidth = 3;
          ctx.beginPath(); ctx.ellipse(0, 18, 28, 12, 0, 0, Math.PI * 2); ctx.stroke();
        }
        const palette = npcData.palette || ["#b5a98e", "#46545a", "#20262a"];
        ctx.fillStyle = "rgba(0,0,0,.28)"; ctx.beginPath(); ctx.ellipse(4, 25, 22, 9, 0, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = palette[1]; ctx.beginPath(); ctx.moveTo(-17, 25); ctx.lineTo(-13, -8); ctx.quadraticCurveTo(0, -22, 13, -8); ctx.lineTo(18, 25); ctx.closePath(); ctx.fill();
        ctx.fillStyle = palette[0]; ctx.beginPath(); ctx.arc(0, -18, 11, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = palette[2]; ctx.font = "700 9px serif"; ctx.textAlign = "center"; ctx.fillText(npcData.glyph || "人", 0, -15);
        ctx.fillStyle = selected ? "#f0d58f" : "rgba(238,234,217,.82)"; ctx.font = "600 12px system-ui"; ctx.fillText(npcData.shortName || npcData.name, 0, 44);
        ctx.restore();
      }
    }

    drawPlayer(player) {
      const ctx = this.ctx;
      const stride = player.moving ? Math.sin(this.elapsed * 11) * 3 : 0;
      ctx.save(); ctx.translate(player.x, player.y);
      ctx.fillStyle = "rgba(0,0,0,.35)"; ctx.beginPath(); ctx.ellipse(5, 23, 25, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#1e3037"; ctx.beginPath(); ctx.moveTo(-18, 24); ctx.lineTo(-14, -8); ctx.quadraticCurveTo(0, -24, 14, -8); ctx.lineTo(19, 24); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#bc9350"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-12, 1); ctx.lineTo(13, 1); ctx.stroke();
      ctx.fillStyle = "#b9a98c"; ctx.beginPath(); ctx.arc(0, -20, 12, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#172126"; ctx.fillRect(-13, -31, 26, 9); ctx.fillRect(-9, -38, 18, 9);
      ctx.fillStyle = "#c7a056"; ctx.beginPath(); ctx.arc(15, 1, 5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = "#24343b"; ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(-8, 22); ctx.lineTo(-10 + stride, 34); ctx.moveTo(8, 22); ctx.lineTo(10 - stride, 34); ctx.stroke();
      ctx.restore();
    }

    drawLighting(map) {
      const ctx = this.ctx;
      ctx.save();
      ctx.fillStyle = map.id === "old_waterworks" ? "rgba(4,8,10,.42)" : "rgba(8,13,16,.13)";
      ctx.fillRect(0, 0, this.width, this.height);
      ctx.globalCompositeOperation = "destination-out";
      for (const deco of map.decorations || []) {
        if (deco.type !== "lamp" && deco.type !== "crystal") continue;
        const x = deco.x - this.camera.x, y = deco.y - this.camera.y;
        const r = deco.radius || (deco.type === "crystal" ? 90 : 145);
        const gradient = ctx.createRadialGradient(x, y, 10, x, y, r);
        gradient.addColorStop(0, "rgba(0,0,0,.85)"); gradient.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = gradient; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
      }
      const player = this.game.state.player;
      const px = player.x - this.camera.x, py = player.y - this.camera.y;
      const pg = ctx.createRadialGradient(px, py, 20, px, py, 150);
      pg.addColorStop(0, "rgba(0,0,0,.8)"); pg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = pg; ctx.beginPath(); ctx.arc(px, py, 150, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }

    drawWeather(map, dt) {
      const ctx = this.ctx;
      const rainAmount = this.game.state?.settings?.rainOverlay === false ? 0 : (map.ambient?.rain || 0);
      if (rainAmount > 0.05) {
        ctx.save(); ctx.strokeStyle = "rgba(174,201,207,.28)"; ctx.lineWidth = 1;
        const count = Math.floor(this.rain.length * rainAmount);
        for (let i = 0; i < count; i += 1) {
          const drop = this.rain[i];
          drop.y += drop.speed * dt; drop.x -= drop.speed * .12 * dt;
          if (drop.y > this.height + 30) { drop.y = -30; drop.x = (drop.x + 193) % this.width; }
          if (drop.x < -20) drop.x = this.width + 20;
          ctx.globalAlpha = drop.alpha;
          ctx.beginPath(); ctx.moveTo(drop.x, drop.y); ctx.lineTo(drop.x - drop.length * .18, drop.y + drop.length); ctx.stroke();
        }
        ctx.restore();
      }
      const fogAmount = map.ambient?.fog || 0;
      if (fogAmount > 0.01) {
        ctx.save();
        for (const cloud of this.fog) {
          cloud.x += cloud.speed * dt;
          if (cloud.x - cloud.radius > this.width) cloud.x = -cloud.radius;
          const g = ctx.createRadialGradient(cloud.x, cloud.y, 0, cloud.x, cloud.y, cloud.radius);
          g.addColorStop(0, `rgba(198,209,208,${cloud.alpha * fogAmount * 5})`); g.addColorStop(1, "rgba(198,209,208,0)");
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2); ctx.fill();
        }
        ctx.restore();
      }
    }

    drawEdgeMood(state, map) {
      const ctx = this.ctx;
      const pressure = state.world.globalRumorPressure / 100;
      const g = ctx.createRadialGradient(this.width / 2, this.height / 2, Math.min(this.width, this.height) * .25, this.width / 2, this.height / 2, Math.max(this.width, this.height) * .72);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, `rgba(${map.id === "old_waterworks" ? "74,20,17" : "5,9,12"},${0.35 + pressure * .32})`);
      ctx.fillStyle = g; ctx.fillRect(0, 0, this.width, this.height);
    }

    drawDebug(map) {
      const ctx = this.ctx;
      ctx.strokeStyle = "rgba(255,70,70,.75)"; ctx.lineWidth = 2;
      for (const obstacle of map.obstacles || []) ctx.strokeRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);
      ctx.strokeStyle = "rgba(70,230,190,.85)";
      for (const item of this.game.interactions.items || []) { ctx.beginPath(); ctx.arc(item.x, item.y, item.radius || 50, 0, Math.PI * 2); ctx.stroke(); }
    }

    shade(hex, amount) {
      const match = String(hex).match(/^#?([0-9a-f]{6})$/i);
      if (!match) return hex;
      const value = parseInt(match[1], 16);
      const r = Util.clamp((value >> 16) + amount, 0, 255);
      const g = Util.clamp(((value >> 8) & 255) + amount, 0, 255);
      const b = Util.clamp((value & 255) + amount, 0, 255);
      return `rgb(${r},${g},${b})`;
    }

    destroy() { window.removeEventListener("resize", this.resize); }
  }

  H.Render.CanvasRenderer = CanvasRenderer;
})(window.Haimachi);
