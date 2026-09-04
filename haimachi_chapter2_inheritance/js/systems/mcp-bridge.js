(function registerMCPBridge(H) {
  "use strict";

  const { Util } = H.Core;

  class MCPBridge {
    constructor(game) {
      this.game = game;
      this.allowedProposalTypes = new Set(["npc_memory_append", "rumor_candidate", "quest_candidate", "faction_intent"]);
      this.proposalBudget = { maxText: 900, maxEffects: 6, maxRisk: 3 };
    }

    getResourceSnapshot() {
      const state = this.game.state;
      return {
        schema: "haimachi-world-resource-v1",
        product: H.Data.Config.title,
        chapter: H.Data.Config.chapter,
        build: H.VERSION,
        revision: state.meta.checksum,
        clock: { day: state.world.day, segment: state.world.segment, weather: state.world.weather },
        player: {
          mapId: state.player.mapId,
          stats: Util.deepClone(state.player.stats),
          level: state.player.level,
        },
        world: {
          stability: state.world.stability,
          publicTrust: state.world.publicTrust,
          globalRumorPressure: state.world.globalRumorPressure,
          districts: Util.deepClone(state.world.districts),
          factions: Util.deepClone(state.world.factions || {}),
          activeRumors: Object.fromEntries(Object.entries(state.world.rumors).filter(([, rumor]) => rumor.active)),
        },
        chapter1Transfer: state.meta.chapter1Transfer ? Util.deepClone(state.meta.chapter1Transfer) : null,
        seriesRecord: state.world.seriesRecord ? Util.deepClone(state.world.seriesRecord) : null,
        knownEvidence: state.evidence.discovered.slice(),
        solvedDeductions: state.deductions.solved.slice(),
        quests: Object.fromEntries(Object.entries(state.quests).map(([id, value]) => [id, { status: value.status, currentStage: value.currentStage }])),
        npcPublicState: Object.fromEntries(Object.entries(state.npcs).map(([id, value]) => [id, { trust: value.trust, state: value.state, mapId: value.mapId }])),
        immutableRules: [
          "AI/MCP出力は提案であり、正式GameStateを直接変更しない",
          "証拠・推理成立・戦闘結果は決定論的ゲームロジックが裁定する",
          "state_patch、任意パス書換え、既知証拠の捏造は拒否する",
        ],
      };
    }

    validateProposal(proposal) {
      const errors = [];
      if (!proposal || typeof proposal !== "object") errors.push("提案はオブジェクトである必要があります。");
      if (!this.allowedProposalTypes.has(proposal?.type)) errors.push("許可されていない提案種別です。");
      if (JSON.stringify(proposal || {}).length > 6000) errors.push("提案サイズが上限を超えています。");
      if (proposal?.effects && proposal.effects.length > this.proposalBudget.maxEffects) errors.push("効果候補が多すぎます。");
      if (proposal?.text && String(proposal.text).length > this.proposalBudget.maxText) errors.push("文章が長すぎます。");
      if (proposal?.type === "state_patch" || proposal?.patch || proposal?.path) errors.push("正式状態への直接パッチは禁止されています。");
      if (proposal?.evidenceId && !H.Data.EvidenceById[proposal.evidenceId]) errors.push("未登録の証拠IDを正式証拠として扱えません。");
      return { accepted: errors.length === 0, errors, sanitized: errors.length ? null : this.sanitize(proposal) };
    }

    sanitize(proposal) {
      const copy = Util.deepClone(proposal);
      if (copy.text) copy.text = String(copy.text).slice(0, this.proposalBudget.maxText);
      delete copy.patch;
      delete copy.path;
      delete copy.state;
      return copy;
    }

    submitProposal(proposal) {
      const validation = this.validateProposal(proposal);
      if (!validation.accepted) return validation;
      const candidate = validation.sanitized;
      this.game.bus.emit("mcp:proposal", { proposal: candidate });
      return {
        accepted: true,
        status: "candidate_only",
        message: "提案を候補キューへ登録しました。正式状態への反映にはゲームルール側の採用処理が必要です。",
        proposal: candidate,
      };
    }

    describeTools() {
      return [
        { name: "get_world_resource", writesState: false, description: "公開可能なゲーム世界状態を取得する。" },
        { name: "submit_world_proposal", writesState: false, description: "NPC記憶・噂候補・派閥意図などを候補として提出する。" },
        { name: "validate_case_candidate", writesState: false, description: "事件候補が既存ルール・証拠グラフと矛盾しないか検証する。" },
      ];
    }
  }

  H.Systems.MCPBridge = MCPBridge;
})(window.Haimachi);
