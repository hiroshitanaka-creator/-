(function registerCombatSystem(H) {
  "use strict";

  const { Util, SeededRNG } = H.Core;

  class CombatSystem {
    constructor(game) {
      this.game = game;
    }

    start(enemyId, encounterId = null) {
      const state = this.game.state;
      const enemy = H.Data.EnemyById[enemyId];
      if (!enemy || state.combat) return false;
      const authority = 1 + state.player.stats.authority;
      state.combat = {
        enemyId,
        encounterId,
        integrity: enemy.maxIntegrity,
        maxIntegrity: enemy.maxIntegrity,
        panic: 0,
        focus: 2 + Math.floor(state.player.stats.observation / 2),
        authority,
        maxAuthority: authority,
        turn: 1,
        phaseIndex: 0,
        observed: 0,
        usedEvidence: [],
        usedDeductions: [],
        resonantUsed: false,
        braced: false,
        log: [{ speaker: "enemy", text: enemy.intro }],
      };
      state.mode = "combat";
      state.paused = true;
      this.syncPhase();
      this.game.audio.ui("danger");
      this.game.bus.emit("combat:open", this.snapshot());
      this.game.addEvent(`噂の化身「${enemy.name}」と対峙した。`, "combat");
      return true;
    }

    snapshot() {
      const combat = this.game.state.combat;
      if (!combat) return null;
      return { ...combat, enemy: H.Data.EnemyById[combat.enemyId], phase: this.currentPhase() };
    }

    currentPhase() {
      const combat = this.game.state.combat;
      const enemy = combat ? H.Data.EnemyById[combat.enemyId] : null;
      return enemy?.phases?.[combat.phaseIndex] || null;
    }

    syncPhase() {
      const combat = this.game.state.combat;
      const enemy = H.Data.EnemyById[combat.enemyId];
      const ratio = combat.integrity / combat.maxIntegrity;
      let index = enemy.phases.length - 1;
      for (let i = 0; i < enemy.phases.length; i += 1) {
        if (ratio >= enemy.phases[i].threshold) { index = i; break; }
      }
      if (index !== combat.phaseIndex) {
        combat.phaseIndex = index;
        combat.log.push({ speaker: "system", text: `噂の論点が変化した――「${enemy.phases[index].claim}」` });
      }
    }

    observe() {
      const combat = this.game.state.combat;
      const enemy = H.Data.EnemyById[combat?.enemyId];
      if (!combat || !enemy) return false;
      const line = enemy.observeLines[combat.observed % enemy.observeLines.length];
      combat.observed += 1;
      combat.focus = Util.clamp(combat.focus + 1, 0, 6);
      combat.log.push({ speaker: "player", text: `観察：${line}` });
      this.game.bus.emit("combat:update", this.snapshot());
      return this.enemyTurn();
    }

    presentEvidence(evidenceId) {
      const combat = this.game.state.combat;
      const evidence = H.Data.EvidenceById[evidenceId];
      if (!combat || !evidence || !this.game.state.evidence.discovered.includes(evidenceId)) return false;
      const phase = this.currentPhase();
      const overlap = evidence.tags.filter((tag) => phase.weaknessTags.includes(tag)).length;
      const resisted = evidence.tags.filter((tag) => phase.resistedTags.includes(tag)).length;
      const repeated = combat.usedEvidence.includes(evidenceId);
      let damage = 7 + evidence.truthWeight * 1.15 + overlap * 9 - resisted * 7 + this.game.state.player.stats.observation * 1.6;
      if (combat.observed > combat.phaseIndex) damage += 4;
      if (repeated) damage *= 0.34;
      damage = Math.max(2, Math.round(damage));
      if (!repeated) combat.usedEvidence.push(evidenceId);
      combat.integrity = Math.max(0, combat.integrity - damage);
      combat.log.push({
        speaker: "player",
        text: `証拠「${evidence.title}」を提示。${overlap ? "主張の弱点へ届いた" : resisted ? "論点がずれ、効果が薄い" : "噂の輪郭をわずかに削った"}（-${damage}）`,
      });
      this.game.audio.combatHit(Math.min(3, 1 + overlap));
      return this.afterPlayerAction();
    }

    invokeDeduction(deductionId) {
      const combat = this.game.state.combat;
      const deduction = H.Data.DeductionById[deductionId];
      if (!combat || !deduction || !this.game.state.deductions.solved.includes(deductionId)) return false;
      if (combat.focus < 1) {
        this.game.bus.emit("ui:notify", { title: "集中が足りない", text: "観察で集中を取り戻す。", icon: "眼", tone: "warning" });
        return false;
      }
      combat.focus -= 1;
      const phase = this.currentPhase();
      const overlap = deduction.tags.filter((tag) => phase.weaknessTags.includes(tag)).length;
      const resisted = deduction.tags.filter((tag) => phase.resistedTags.includes(tag)).length;
      const repeated = combat.usedDeductions.includes(deductionId);
      let damage = 15 + deduction.truthValue * 0.9 + overlap * 11 - resisted * 6;
      if (repeated) damage *= 0.42;
      damage = Math.max(5, Math.round(damage));
      if (!repeated) combat.usedDeductions.push(deductionId);
      combat.integrity = Math.max(0, combat.integrity - damage);
      combat.panic = Math.max(0, combat.panic - 5 - this.game.state.player.stats.empathy);
      combat.log.push({ speaker: "player", text: `推理「${deduction.shortTitle}」を固定。${deduction.shortResult}（-${damage}）` });
      this.game.audio.ui("deduction");
      return this.afterPlayerAction();
    }

    calm() {
      const combat = this.game.state.combat;
      if (!combat) return false;
      const empathy = this.game.state.player.stats.empathy;
      const composureGain = 8 + empathy * 5;
      const panicDrop = 7 + empathy * 3;
      this.game.state.player.composure = Util.clamp(this.game.state.player.composure + composureGain, 0, this.game.state.player.maxComposure);
      combat.panic = Math.max(0, combat.panic - panicDrop);
      combat.braced = true;
      combat.log.push({ speaker: "player", text: `周囲の声を一度止め、確認できる事実だけを読み上げた。平静 +${composureGain}、群衆不安 -${panicDrop}。` });
      return this.enemyTurn();
    }

    seal() {
      const combat = this.game.state.combat;
      if (!combat) return false;
      if (combat.authority <= 0) {
        this.game.bus.emit("ui:notify", { title: "権限を使い切った", text: "この対峙では追加の封印命令を出せない。", icon: "印", tone: "warning" });
        return false;
      }
      combat.authority -= 1;
      const damage = 13 + this.game.state.player.stats.authority * 5;
      combat.integrity = Math.max(0, combat.integrity - damage);
      combat.panic = Math.max(0, combat.panic - 10);
      combat.log.push({ speaker: "player", text: `巡察印で噂の拡散経路を一時封鎖した。（-${damage}／不安 -10）` });
      return this.afterPlayerAction();
    }

    useResonantShard() {
      const state = this.game.state;
      const combat = state.combat;
      if (!combat || combat.resonantUsed || !state.player.inventory.resonant_shard) return false;
      combat.resonantUsed = true;
      combat.integrity = Math.max(0, combat.integrity - 28);
      combat.panic = Math.max(0, combat.panic - 22);
      combat.focus = Util.clamp(combat.focus + 2, 0, 6);
      combat.log.push({ speaker: "player", text: "黒鐘の逆相片を打ち、濁った三拍を一度だけ割った。次の反撃を完全に遮断する。（-28）" });
      combat.skipEnemyTurn = true;
      this.game.audio.ui("deduction");
      return this.afterPlayerAction();
    }

    retreat() {
      const combat = this.game.state.combat;
      if (!combat) return false;
      combat.log.push({ speaker: "system", text: "証拠を失う前に対峙を中断した。噂は勢いを増す。" });
      this.game.state.world.globalRumorPressure = Util.clamp(this.game.state.world.globalRumorPressure + 4, 0, 100);
      this.game.time.advance(1, "噂との対峙から撤退");
      this.finish(false, true);
      return true;
    }

    afterPlayerAction() {
      const combat = this.game.state.combat;
      if (!combat) return false;
      this.syncPhase();
      if (combat.integrity <= 0) return this.finish(true);
      this.game.bus.emit("combat:update", this.snapshot());
      if (combat.skipEnemyTurn) {
        combat.skipEnemyTurn = false;
        combat.turn += 1;
        combat.log.push({ speaker: "system", text: "逆相片の余韻が反撃を遮った。" });
        this.game.bus.emit("combat:update", this.snapshot());
        return true;
      }
      return this.enemyTurn();
    }

    enemyTurn() {
      const state = this.game.state;
      const combat = state.combat;
      const enemy = H.Data.EnemyById[combat?.enemyId];
      if (!combat || !enemy) return false;
      const rng = new SeededRNG(state.rng?.seed || "combat");
      rng.restore(state.rng);
      const attack = rng.pick(enemy.attacks);
      state.rng = rng.snapshot();
      const difficulty = H.Data.Config.difficulty[state.settings.difficulty].combatDamage;
      const braceMultiplier = combat.braced ? 0.58 : 1;
      combat.braced = false;
      const damage = Math.max(1, Math.round((attack.damage + combat.phaseIndex * 2) * difficulty * braceMultiplier));
      const panic = Math.max(1, Math.round(attack.panic * difficulty * braceMultiplier));
      state.player.composure = Math.max(0, state.player.composure - damage);
      combat.panic = Util.clamp(combat.panic + panic, 0, 100);
      combat.turn += 1;
      combat.log.push({ speaker: "enemy", text: `${attack.text} 平静 -${damage}、群衆不安 +${panic}。` });
      this.game.audio.combatHit(1.5);
      if (state.player.composure <= 0 || combat.panic >= 100) return this.finish(false);
      combat.focus = Util.clamp(combat.focus + (combat.turn % 3 === 0 ? 1 : 0), 0, 6);
      this.game.bus.emit("combat:update", this.snapshot());
      return true;
    }

    finish(victory, voluntary = false) {
      const state = this.game.state;
      const combat = state.combat;
      if (!combat) return false;
      const enemy = H.Data.EnemyById[combat.enemyId];
      const encounterId = combat.encounterId;
      if (victory) {
        if (encounterId && !state.world.clearedEncounters.includes(encounterId)) state.world.clearedEncounters.push(encounterId);
        const rewards = enemy.rewards || {};
        this.game.effects.apply([
          { type: "xp", value: rewards.xp || 0 },
          { type: "world", path: "publicTrust", value: rewards.trust || 0 },
          { type: "world", path: "globalRumorPressure", value: -(rewards.rumorReduction || 0) },
          ...(enemy.effects || []),
        ], { enemyId: enemy.id, encounterId, reason: `噂を鎮めた：${enemy.name}` });
        this.game.addEvent(`${enemy.name}を論破した。${enemy.victory}`, "victory");
        this.game.bus.emit("combat:finish", { victory: true, enemy, text: enemy.victory, snapshot: this.snapshot() });
      } else {
        const penalty = voluntary ? 4 : 9;
        state.world.globalRumorPressure = Util.clamp(state.world.globalRumorPressure + penalty, 0, 100);
        state.world.publicTrust = Util.clamp(state.world.publicTrust - (voluntary ? 1 : 4), 0, 100);
        state.player.composure = Math.max(35, Math.round(state.player.maxComposure * 0.48));
        this.game.addEvent(`${enemy.name}との対峙から撤退した。${enemy.defeat}`, "defeat");
        this.game.bus.emit("combat:finish", { victory: false, enemy, text: voluntary ? "対峙を中断した。再挑戦できる。" : enemy.defeat, snapshot: this.snapshot() });
        if (!voluntary) {
          const safeMap = state.player.lastSafeMap || H.Data.Config.startMap;
          const safe = state.player.lastSafePosition || H.Data.Maps[safeMap].spawn;
          setTimeout(() => this.game.world.enterMap(safeMap, safe.x, safe.y, { force: true }), 0);
          this.game.time.advance(1, "撤退と休息");
        }
      }
      state.combat = null;
      state.mode = "exploration";
      state.paused = false;
      this.game.world.recalculateWorldMetrics();
      this.game.quests.evaluateAll();
      this.game.saveManager.scheduleAutoSave(state);
      return true;
    }
  }

  H.Systems.CombatSystem = CombatSystem;
})(window.Haimachi);
