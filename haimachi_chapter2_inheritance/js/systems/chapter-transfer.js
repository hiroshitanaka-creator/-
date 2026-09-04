(function registerChapterTransfer(H) {
  "use strict";

  const TRANSFER_TYPE = "haimachi.chapter1.transfer";
  const SERIES_KEY = "haimachi-series:chapter1-transfer";
  const LOCAL_KEY = "haimachi-chapter2:selected-chapter1-transfer";
  const LEGACY_KEY = "haimachi-chapter1:transfer";
  const ACCEPTED_TYPES = new Set([TRANSFER_TYPE, "haimachi.chapter-transfer", "haimachi.chapterTransfer"]);
  const REQUIRED_CH1_DEDUCTIONS = [
    "d_watch_detained_eld",
    "d_eld_in_waterworks",
    "d_dario_ordered_coverup",
    "d_gray_salt_mechanism",
    "d_complete_case",
  ];
  const PROFILE_BY_ENDING = {
    ending_true_map: "true_map",
    ending_ordered_truth: "ordered_truth",
    ending_unshielded_truth: "unshielded_truth",
    ending_sealed_order: "sealed_order",
    ending_false_beast: "false_beast",
    ending_ines_scapegoat: "scapegoat_ines",
    ending_partial_case: "partial_case",
    ending_bargain: "bargain_order",
  };
  const PROFILE_LABEL = {
    true_map: "真相固定・証人保護済み",
    ordered_truth: "秩序内公開・一部封印",
    unshielded_truth: "即時公開・証人危険",
    sealed_order: "秩序封印・仕組み温存",
    false_beast: "灰獣説採用・真相未固定",
    scapegoat_ines: "イネス単独責任化",
    partial_case: "部分解明・追跡継続",
    bargain_order: "巡察隊との取引成立",
  };
  const ENDING_TITLE = {
    ending_true_map: "嘘の上に、逃げ道を引く",
    ending_unshielded_truth: "真実は正しく、順序を持たなかった",
    ending_ordered_truth: "秩序の中へ埋めた半分の真実",
    ending_sealed_order: "怪異は訂正され、仕組みは残った",
    ending_false_beast: "獣のために、人が消された",
    ending_ines_scapegoat: "空白を作った者だけが裁かれた",
    ending_partial_case: "正しい方向へ、短すぎる線を引いた",
    ending_bargain: "一人を退かせ、仕組みと取引した",
  };

  const clamp = (value, min = 0, max = 100) => H.Core.Util.clamp(Math.round(value), min, max);
  const deepClone = (value) => H.Core.Util.deepClone(value);
  const checksumPayload = (payload) => {
    const copy = deepClone(payload);
    delete copy.checksum;
    return H.Core.Util.stableHash(copy);
  };

  class ChapterTransfer {
    constructor(game) {
      this.game = game;
      this.seriesKey = SERIES_KEY;
      this.localKey = LOCAL_KEY;
      this.legacyKey = LEGACY_KEY;
      this.lastError = null;
    }

    readStored() {
      if (typeof localStorage === "undefined") return null;
      for (const key of [this.localKey, this.seriesKey, this.legacyKey]) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const payload = this.normalize(JSON.parse(raw));
          if (this.validate(payload).ok) return payload;
        } catch (error) {
          this.lastError = error;
          console.warn("Stored chapter transfer ignored", error);
        }
      }
      return null;
    }

    persist(payload) {
      const normalized = this.normalize(payload);
      const check = this.validate(normalized);
      if (!check.ok) throw new Error(check.error);
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(this.localKey, JSON.stringify(normalized));
        localStorage.setItem(this.seriesKey, JSON.stringify(normalized));
      }
      this.game.bus?.emit("transfer:imported", { payload: normalized });
      return normalized;
    }

    clear() {
      if (typeof localStorage === "undefined") return;
      localStorage.removeItem(this.localKey);
      localStorage.removeItem(this.seriesKey);
      this.game.bus?.emit("transfer:cleared", {});
    }

    async importFile(file) {
      const text = await H.Core.Util.readFileText(file);
      const parsed = JSON.parse(text);
      return this.persist(parsed);
    }

    normalize(input) {
      if (!input || typeof input !== "object") throw new Error("継承データの形式が不正です。");
      if (ACCEPTED_TYPES.has(input.type)) {
        const payload = deepClone(input);
        payload.type = TRANSFER_TYPE;
        payload.schemaVersion = payload.schemaVersion || 1;
        payload.sourceChapter = payload.sourceChapter || 1;
        payload.targetChapter = payload.targetChapter || 2;
        payload.chapter = payload.chapter || {};
        payload.chapter.profile = payload.chapter.profile || PROFILE_BY_ENDING[payload.chapter.endingId] || "partial_case";
        payload.chapter.profileLabel = payload.chapter.profileLabel || PROFILE_LABEL[payload.chapter.profile] || "第一章記録";
        payload.player = payload.player || { name: "レイ" };
        payload.readiness = payload.readiness || {};
        payload.facts = payload.facts || {};
        payload.report = payload.report || null;
        payload.records = payload.records || { solvedDeductions: [], discoveredEvidence: [], npcTrust: {}, lastEvents: [] };
        payload.world = payload.world || {};
        payload.carryover = payload.carryover || this.carryoverTags(payload.chapter.profile, payload.report, payload.readiness, payload.facts);
        payload.checksum = checksumPayload(payload);
        return payload;
      }
      if (this.looksLikeChapter1Save(input)) return this.fromChapter1Save(input);
      throw new Error("第一章の継承JSON、または第一章の巡察記録JSONではありません。");
    }

    looksLikeChapter1Save(input) {
      const version = String(input.meta?.gameVersion || "");
      const cause = input.world?.report?.cause;
      const ch1Cause = ["beast", "detention", "smuggling", "compound"].includes(cause);
      return Boolean(version.includes("chapter1") || (ch1Cause && input.world?.report && input.world?.endingId));
    }

    fromChapter1Save(state) {
      const flags = state.world?.flags || {};
      const report = state.world?.report || null;
      if (!flags.chapter_complete || !report || !state.world?.endingId) {
        throw new Error("第一章の正式報告後のセーブではありません。結末到達後の巡察記録を書き出してください。");
      }
      const solved = new Set(state.deductions?.solved || []);
      const endingId = state.world.endingId;
      const profile = PROFILE_BY_ENDING[endingId] || this.classify({ endingId, report, flags, solved });
      const npcTrust = {};
      for (const [id, npc] of Object.entries(state.npcs || {})) npcTrust[id] = Math.round(npc.trust ?? 0);
      const readiness = {
        eldRescued: Boolean(flags.eld_rescued),
        witnessProtection: Boolean(flags.witness_protection_ready),
        bellRepaired: Boolean(flags.rain_bell_repaired),
        solvedKey: REQUIRED_CH1_DEDUCTIONS.filter((id) => solved.has(id)).length,
        requiredKey: REQUIRED_CH1_DEDUCTIONS.length,
        evidenceCount: state.evidence?.discovered?.length || 0,
        stability: Math.round(state.world?.stability ?? 0),
        publicTrust: Math.round(state.world?.publicTrust ?? 0),
        northFear: Math.round(state.world?.districts?.north?.fear ?? 0),
      };
      const facts = {
        eldRescued: Boolean(flags.eld_rescued),
        witnessProtectionReady: Boolean(flags.witness_protection_ready),
        rainBellRepaired: Boolean(flags.rain_bell_repaired),
        inesConfessed: Boolean(flags.ines_confessed),
        inesWhistleblowerProven: Boolean(flags.ines_whistleblower_proven),
        darioCommandProven: Boolean(flags.dario_command_proven),
        graySaltMechanismProven: solved.has("d_gray_salt_mechanism") || Boolean(flags.gray_salt_mechanism_proven),
        completeCaseSolved: solved.has("d_complete_case"),
        reportUnlocked: Boolean(flags.report_unlocked),
      };
      const payload = {
        type: TRANSFER_TYPE,
        schemaVersion: 1,
        sourceChapter: 1,
        targetChapter: 2,
        createdAt: new Date().toISOString(),
        sourceVersion: state.meta?.gameVersion || "chapter1-save",
        player: {
          name: state.player?.name || "レイ",
          rank: state.player?.rank || "巡察記録官",
          level: state.player?.level || 1,
          stats: deepClone(state.player?.stats || {}),
          currencies: deepClone(state.player?.currencies || {}),
        },
        chapter: {
          complete: true,
          endingId,
          endingTitle: ENDING_TITLE[endingId] || endingId,
          profile,
          profileLabel: PROFILE_LABEL[profile] || "第一章記録",
          day: state.world?.day || 1,
          segment: state.world?.segment || 0,
          playtimeSeconds: state.meta?.playtimeSeconds || 0,
        },
        report: {
          cause: report.cause || null,
          responsible: report.responsible || null,
          policy: report.policy || null,
          note: report.note || "",
          submittedAt: deepClone(report.submittedAt || null),
        },
        readiness,
        facts,
        records: {
          solvedDeductions: (state.deductions?.solved || []).slice(),
          discoveredEvidence: (state.evidence?.discovered || []).slice(),
          npcTrust,
          lastEvents: (state.world?.eventHistory || []).slice(-10),
        },
        world: {
          stability: Math.round(state.world?.stability ?? 0),
          publicTrust: Math.round(state.world?.publicTrust ?? 0),
          globalRumorPressure: Math.round(state.world?.globalRumorPressure ?? 0),
          districtSnapshot: deepClone(state.world?.districts || {}),
        },
        carryover: [],
        checksum: "",
      };
      payload.carryover = this.carryoverTags(profile, payload.report, readiness, facts);
      payload.checksum = checksumPayload(payload);
      return payload;
    }

    classify({ endingId, report, solved }) {
      if (PROFILE_BY_ENDING[endingId]) return PROFILE_BY_ENDING[endingId];
      if (report?.cause === "beast") return "false_beast";
      if (report?.responsible === "ines") return "scapegoat_ines";
      if (report?.policy === "bargain") return "bargain_order";
      if (report?.policy === "sealed") return "sealed_order";
      if (solved?.has?.("d_complete_case") && report?.policy === "staged") return "true_map";
      return "partial_case";
    }

    carryoverTags(profile, report, readiness, facts) {
      const tags = [profile];
      if (report?.policy) tags.push(`policy:${report.policy}`);
      if (report?.responsible) tags.push(`responsible:${report.responsible}`);
      tags.push(readiness.eldRescued || facts.eldRescued ? "eld_rescued" : "eld_not_secured");
      tags.push(readiness.witnessProtection || facts.witnessProtectionReady ? "witness_protected" : "witness_exposed");
      if (readiness.bellRepaired || facts.rainBellRepaired) tags.push("rain_bell_repaired");
      if (facts.inesConfessed) tags.push("ines_confessed");
      return tags;
    }

    validate(payload) {
      if (!payload || payload.type !== TRANSFER_TYPE) return { ok: false, error: "第一章継承データではありません。" };
      if (payload.sourceChapter !== 1 || payload.targetChapter !== 2) return { ok: false, error: "第一章→第二章のデータではありません。" };
      if (!payload.chapter?.complete || !payload.report) return { ok: false, error: "第一章の正式報告後のデータではありません。" };
      if (!payload.player?.name) return { ok: false, error: "巡察官名がありません。" };
      return { ok: true };
    }

    getImpactProfile(payload) {
      const p = payload.chapter?.profile || "partial_case";
      const base = {
        label: PROFILE_LABEL[p] || "第一章記録",
        stability: 0,
        publicTrust: 0,
        rumor: 0,
        playerXp: 0,
        truthTokens: 0,
        patrolMarks: 0,
        unlockMaps: [],
        flags: [`ch1_${p}`],
        npcTrust: {},
        districts: {},
        rumors: {},
        factions: {},
        notes: [],
      };
      const set = (target, id, patch) => { target[id] = { ...(target[id] || {}), ...patch }; };
      switch (p) {
        case "true_map":
          Object.assign(base, { stability: 7, publicTrust: 9, rumor: -7, playerXp: 30, truthTokens: 2, patrolMarks: 3, unlockMaps: ["audit_hall"] });
          base.flags.push("ch1_truth_anchor", "ch1_eld_safe", "ch1_witness_line_secured", "ch1_dario_network_exposed");
          Object.assign(base.npcTrust, { naira: 10, eld: 12, ines: 9, oren: -4, maren: -3, sabra: -4, enja: -2 });
          set(base.districts, "archive", { trust: 7, security: 4, rumorPressure: -4 });
          set(base.districts, "east", { fear: -4, trust: 5, rumorPressure: -5 });
          set(base.districts, "ledger", { fear: 2, trust: -1, rumorPressure: 4 });
          set(base.rumors, "r_black_rain", { intensity: -10, credibility: -7 });
          set(base.rumors, "r_eld_lied", { intensity: -15, credibility: -12 });
          set(base.rumors, "r_name_debt", { active: true, intensity: 4, credibility: 8 });
          Object.assign(base.factions, { map_bureau: { attitude: 12, pressure: -6 }, citizen_network: { attitude: 14, influence: 4 }, ledger_cartel: { attitude: -8, pressure: 5 }, audit_bureau: { attitude: 4 } });
          base.notes.push("第一章の完全報告が採用され、第二章では監査庁への通行線が最初から半分開いている。");
          break;
        case "ordered_truth":
          Object.assign(base, { stability: 4, publicTrust: 4, rumor: -1, playerXp: 18, truthTokens: 1, patrolMarks: 2 });
          base.flags.push("ch1_ordered_record", "ch1_partial_seal");
          Object.assign(base.npcTrust, { naira: 6, eld: 6, ines: 7, maren: 1, sabra: -2 });
          set(base.districts, "archive", { trust: 5, security: 3, rumorPressure: -2 });
          set(base.districts, "east", { trust: 2 });
          set(base.rumors, "r_black_rain", { intensity: -4, credibility: -3 });
          set(base.rumors, "r_eld_lied", { intensity: -5, credibility: -4 });
          Object.assign(base.factions, { map_bureau: { attitude: 7 }, citizen_network: { attitude: 4 }, ledger_cartel: { pressure: 2 } });
          base.notes.push("真相は保存されたが一部封印され、第二章では行政側の協力と不透明さが同時に残る。");
          break;
        case "unshielded_truth":
          Object.assign(base, { stability: -5, publicTrust: 3, rumor: 11, playerXp: 20, truthTokens: 1, patrolMarks: 1 });
          base.flags.push("ch1_truth_without_shield", "ch1_witnesses_endangered");
          Object.assign(base.npcTrust, { naira: 2, eld: -2, ines: -5, oren: 3, maren: -4, enja: -3 });
          set(base.districts, "east", { fear: 8, rumorPressure: 9, trust: -3 });
          set(base.districts, "ledger", { fear: 5, rumorPressure: 7 });
          set(base.rumors, "r_black_rain", { intensity: 9, credibility: 7 });
          set(base.rumors, "r_eld_lied", { intensity: 12, credibility: 8 });
          Object.assign(base.factions, { citizen_network: { attitude: 5, pressure: 8 }, audit_bureau: { attitude: -6, pressure: 7 }, rumor_brokers: { attitude: 8, influence: 4 } });
          base.notes.push("真実の衝撃が先に街へ走り、黒雨は『正しい暴露の副作用』として語られ始めている。");
          break;
        case "sealed_order":
          Object.assign(base, { stability: 3, publicTrust: -8, rumor: 7, playerXp: 8, patrolMarks: 1 });
          base.flags.push("ch1_record_sealed", "ch1_mechanism_survived");
          Object.assign(base.npcTrust, { naira: -4, eld: -8, ines: -10, maren: 5, sabra: 4, enja: 2 });
          set(base.districts, "archive", { security: 6, trust: -5, rumorPressure: 5 });
          set(base.districts, "east", { fear: 3, rumorPressure: 5 });
          set(base.rumors, "r_black_rain", { intensity: 6, credibility: 4 });
          set(base.rumors, "r_eld_lied", { intensity: 16, credibility: 12 });
          Object.assign(base.factions, { map_bureau: { attitude: -5, pressure: 3 }, ledger_cartel: { attitude: 5, influence: 3 }, audit_bureau: { attitude: 6 }, citizen_network: { attitude: -8, pressure: 6 } });
          base.notes.push("灰獣説は訂正されたが仕組みは温存され、第二章の公債側が動きやすくなっている。");
          break;
        case "false_beast":
          Object.assign(base, { stability: -10, publicTrust: -12, rumor: 18, playerXp: 4 });
          base.flags.push("ch1_false_beast_record", "ch1_truth_buried");
          Object.assign(base.npcTrust, { naira: -12, eld: -15, ines: -8, oren: 6, maren: 3, sabra: 7 });
          set(base.districts, "east", { fear: 11, rumorPressure: 13, trust: -8 });
          set(base.districts, "ledger", { fear: 8, rumorPressure: 10, trust: -4 });
          set(base.rumors, "r_black_rain", { intensity: 18, credibility: 16 });
          set(base.rumors, "r_eld_lied", { intensity: 10, credibility: 6 });
          Object.assign(base.factions, { rumor_brokers: { attitude: 12, influence: 7 }, ledger_cartel: { attitude: 8, influence: 4 }, citizen_network: { attitude: -12, pressure: 10 }, map_bureau: { attitude: -10 } });
          base.notes.push("灰獣説が公式記録に残ったため、第二章では黒雨が『天罰』として非常に強く立ち上がる。背負うペナルティは大きい。");
          break;
        case "scapegoat_ines":
          Object.assign(base, { stability: -4, publicTrust: -7, rumor: 9, playerXp: 10 });
          base.flags.push("ch1_ines_scapegoated", "ch1_whistleblower_wounded");
          Object.assign(base.npcTrust, { naira: -5, eld: -4, ines: -24, maren: 4, sabra: 2, oren: 3 });
          set(base.districts, "archive", { trust: -8, rumorPressure: 7 });
          set(base.rumors, "r_eld_lied", { intensity: 11, credibility: 7 });
          set(base.rumors, "r_black_rain", { intensity: 6, credibility: 3 });
          Object.assign(base.factions, { audit_bureau: { attitude: 5 }, citizen_network: { attitude: -7 }, map_bureau: { attitude: -6, pressure: 5 } });
          base.notes.push("イネスを責任者にした記録が残り、第二章の書記系証言は鋭くなるが協力は得にくい。 ");
          break;
        case "bargain_order":
          Object.assign(base, { stability: 1, publicTrust: -9, rumor: 8, playerXp: 7, patrolMarks: 1 });
          base.flags.push("ch1_bargain_made", "ch1_network_negotiated");
          Object.assign(base.npcTrust, { naira: -6, eld: -7, ines: -7, sabra: 8, maren: 4, enja: 5, oren: 2 });
          set(base.districts, "ledger", { trust: 4, security: 3, rumorPressure: 6 });
          set(base.districts, "east", { rumorPressure: 5 });
          set(base.rumors, "r_eld_lied", { intensity: 13, credibility: 9 });
          set(base.rumors, "r_name_debt", { active: true, intensity: 6, credibility: 5 });
          Object.assign(base.factions, { ledger_cartel: { attitude: 12, influence: 5 }, audit_bureau: { attitude: 3 }, citizen_network: { attitude: -9 }, map_bureau: { attitude: -4 } });
          base.notes.push("第一章で取引した記録が残り、公債商はあなたを交渉可能な相手として扱う。市民側の不信は強い。 ");
          break;
        default:
          Object.assign(base, { stability: -2, publicTrust: -2, rumor: 6, playerXp: 8 });
          base.flags.push("ch1_partial_record", "ch1_case_threads_open");
          Object.assign(base.npcTrust, { naira: 0, eld: 2, ines: 1, oren: 2, maren: 1, sabra: 1 });
          set(base.districts, "east", { fear: 3, rumorPressure: 5 });
          set(base.rumors, "r_black_rain", { intensity: 6, credibility: 4 });
          set(base.rumors, "r_eld_lied", { intensity: 7, credibility: 4 });
          Object.assign(base.factions, { rumor_brokers: { attitude: 4, influence: 2 }, audit_bureau: { pressure: 3 } });
          base.notes.push("第一章の線は途切れず残った。第二章では未解決の余白が黒雨の材料になる。 ");
      }
      if (payload.readiness?.eldRescued === false) {
        base.npcTrust.eld = (base.npcTrust.eld || 0) - 8;
        base.flags.push("ch1_eld_late_rescue");
        set(base.rumors, "r_eld_lied", { intensity: (base.rumors.r_eld_lied?.intensity || 0) + 5, credibility: (base.rumors.r_eld_lied?.credibility || 0) + 4 });
        base.notes.push("エルドは後日救出扱いだが、第一章で守れなかった傷が信頼低下として残る。 ");
      }
      if (payload.readiness?.witnessProtection === false) {
        base.npcTrust.ines = (base.npcTrust.ines || 0) - 5;
        base.npcTrust.eld = (base.npcTrust.eld || 0) - 3;
        base.flags.push("ch1_witnesses_unshielded");
        set(base.rumors, "r_eld_lied", { intensity: (base.rumors.r_eld_lied?.intensity || 0) + 4 });
      }
      if (payload.report?.policy === "immediate") {
        base.flags.push("ch1_immediate_publication");
      } else if (payload.report?.policy === "staged") {
        base.flags.push("ch1_staged_publication");
      } else if (payload.report?.policy === "sealed") {
        base.flags.push("ch1_sealed_policy");
      } else if (payload.report?.policy === "bargain") {
        base.flags.push("ch1_bargain_policy");
      }
      return base;
    }

    boolText(value, yes, no) { return value ? yes : no; }

    buildSeriesRecord(payload) {
      if (!payload) return null;
      const data = this.normalize(payload);
      const impact = this.getImpactProfile(data);
      const readiness = data.readiness || {};
      const report = data.report || {};
      const reportLine = `${this.reportLabel("cause", report.cause)}／${this.reportLabel("responsible", report.responsible)}／${this.reportLabel("policy", report.policy)}`;
      const flags = [
        { id: "eld", label: "エルド救出", ok: Boolean(readiness.eldRescued), detail: readiness.eldRescued ? "失踪者が第二章で証言者として扱われる。" : "救出の遅れが、エルド証言疑惑の噂を強める。" },
        { id: "witness", label: "証人保護", ok: Boolean(readiness.witnessProtection), detail: readiness.witnessProtection ? "イネスと市民網が協力的に始まる。" : "記録官系NPCが沈黙しやすくなる。" },
        { id: "bell", label: "雨鐘修復", ok: Boolean(readiness.bellRepaired), detail: readiness.bellRepaired ? "鐘楼鋳造組合への追及線が早く開く。" : "黒鐘の説明が『怪異』へ寄りやすい。" },
        { id: "complete_case", label: "完全推理", ok: Boolean(data.facts?.completeCaseSolved), detail: data.facts?.completeCaseSolved ? "第一章の公式記録が、黒雨へ対抗する基準線になる。" : "未解明部分が黒雨の読み替え材料になる。" },
      ];
      const worldDeltas = [
        { label: "街の安定", value: impact.stability },
        { label: "市民信頼", value: impact.publicTrust },
        { label: "噂圧", value: impact.rumor },
        { label: "真実札", value: impact.truthTokens },
        { label: "巡察印", value: impact.patrolMarks },
      ];
      const npcDeltas = Object.entries(impact.npcTrust).map(([id, delta]) => {
        const npc = H.Data.NPCById?.[id] || H.Data.NPCs?.find?.((entry) => entry.id === id) || { name: id };
        return { id, name: npc.name || id, delta };
      });
      const rumorDeltas = Object.entries(impact.rumors).map(([id, patch]) => {
        const rumor = H.Data.Config.initialRumors?.find?.((entry) => entry.id === id) || { title: id };
        return { id, title: rumor.title || id, intensity: patch.intensity || 0, credibility: patch.credibility || 0, active: Boolean(patch.active) };
      });
      const factionDeltas = Object.entries(impact.factions).map(([id, patch]) => {
        const faction = H.Data.Config.factions?.find?.((entry) => entry.id === id) || { name: id, shortName: id };
        return { id, name: faction.shortName || faction.name || id, attitude: patch.attitude || 0, influence: patch.influence || 0, pressure: patch.pressure || 0 };
      });
      const recallLog = [
        { category: "結末", text: `第一章は「${data.chapter.endingTitle}」として記録された。`, tone: "primary" },
        { category: "正式報告", text: `認定：${reportLine}。`, tone: "neutral" },
        { category: "救出", text: this.boolText(readiness.eldRescued, "エルドは証言者として保護された。", "エルドの救出線は不安定で、第二章では証言の信用が揺らぐ。"), tone: readiness.eldRescued ? "positive" : "warning" },
        { category: "証人保護", text: this.boolText(readiness.witnessProtection, "証人保護網は第一章の記録を信じて動き始める。", "証人保護の不足が、沈黙と報復恐怖を残した。"), tone: readiness.witnessProtection ? "positive" : "danger" },
        { category: "雨鐘", text: this.boolText(readiness.bellRepaired, "雨鐘修復により、黒鐘の偽装を追う基準音が残った。", "未修復の雨鐘は、黒雨の怪異説を強める余白になった。"), tone: readiness.bellRepaired ? "positive" : "warning" },
        { category: "公開方針", text: `公開方針「${this.reportLabel("policy", report.policy)}」は、第二章の新聞見出しと噂文を変える。`, tone: report.policy === "staged" ? "positive" : "neutral" },
        ...impact.notes.map((text) => ({ category: "第二章への影響", text, tone: "neutral" })),
      ];
      return {
        type: "haimachi.series.record",
        schemaVersion: 1,
        createdAt: new Date().toISOString(),
        player: { name: data.player.name, rank: data.player.rank || "巡察記録官" },
        chapter1: {
          endingId: data.chapter.endingId,
          endingTitle: data.chapter.endingTitle,
          profile: data.chapter.profile,
          profileLabel: data.chapter.profileLabel,
          reportLine,
          cause: this.reportLabel("cause", report.cause),
          responsible: this.reportLabel("responsible", report.responsible),
          policy: this.reportLabel("policy", report.policy),
          day: data.chapter.day || 1,
          playtimeSeconds: data.chapter.playtimeSeconds || 0,
          solvedKey: readiness.solvedKey || 0,
          requiredKey: readiness.requiredKey || 0,
          evidenceCount: readiness.evidenceCount || 0,
        },
        flags,
        deltas: { world: worldDeltas, npcs: npcDeltas, rumors: rumorDeltas, factions: factionDeltas, notes: impact.notes.slice() },
        recallLog,
        carryoverTags: (data.carryover || []).slice(),
        briefingPages: this.buildPrologue(data),
        checksum: data.checksum,
      };
    }

    applyToState(state, payload) {
      const data = this.normalize(payload);
      const check = this.validate(data);
      if (!check.ok) throw new Error(check.error);
      const impact = this.getImpactProfile(data);
      const seriesRecord = this.buildSeriesRecord(data);
      state.meta.chapter1Transfer = {
        appliedAt: new Date().toISOString(),
        playerName: data.player.name,
        endingId: data.chapter.endingId,
        endingTitle: data.chapter.endingTitle,
        profile: data.chapter.profile,
        profileLabel: data.chapter.profileLabel,
        report: deepClone(data.report),
        readiness: deepClone(data.readiness),
        impactSummary: impact.notes.slice(),
        rawPayload: deepClone(data),
        seriesRecordVersion: 1,
        checksum: data.checksum,
      };
      state.world.seriesRecord = seriesRecord;
      state.player.name = String(data.player.name || state.player.name || "レイ").slice(0, 12);
      state.player.xp += impact.playerXp;
      state.player.currencies.truthTokens = (state.player.currencies.truthTokens || 0) + impact.truthTokens;
      state.player.currencies.patrolMarks = (state.player.currencies.patrolMarks || 0) + impact.patrolMarks;
      for (const [stat, value] of Object.entries(data.player.stats || {})) {
        if (Object.prototype.hasOwnProperty.call(state.player.stats, stat)) {
          state.player.stats[stat] = Math.max(state.player.stats[stat], Math.min(3, Number(value) || 1));
        }
      }
      for (const flag of impact.flags) state.world.flags[flag] = true;
      state.world.flags.inherited_chapter1 = true;
      state.world.flags.ch1_eld_rescued = Boolean(data.readiness?.eldRescued || data.facts?.eldRescued);
      state.world.flags.ch1_witness_protection = Boolean(data.readiness?.witnessProtection || data.facts?.witnessProtectionReady);
      state.world.flags.ch1_rain_bell_repaired = Boolean(data.readiness?.bellRepaired || data.facts?.rainBellRepaired);
      state.world.flags.ch1_complete_case = Boolean(data.facts?.completeCaseSolved);
      for (const mapId of impact.unlockMaps) {
        if (H.Data.Maps[mapId] && !state.world.unlockedMaps.includes(mapId)) state.world.unlockedMaps.push(mapId);
      }
      state.world.publicTrust = clamp(state.world.publicTrust + impact.publicTrust);
      state.world.stability = clamp(state.world.stability + impact.stability);
      state.world.globalRumorPressure = clamp(state.world.globalRumorPressure + impact.rumor);
      for (const [npcId, delta] of Object.entries(impact.npcTrust)) {
        if (state.npcs[npcId]) {
          state.npcs[npcId].trust = clamp((state.npcs[npcId].trust || 0) + delta);
          state.npcs[npcId].memory.push({
            topicId: "chapter1_inheritance",
            optionId: data.chapter.profile,
            marker: data.chapter.profileLabel,
            day: 1,
            segment: 0,
          });
        }
      }
      for (const [districtId, patch] of Object.entries(impact.districts)) {
        const district = state.world.districts[districtId];
        if (!district) continue;
        for (const [key, delta] of Object.entries(patch)) district[key] = clamp((district[key] || 0) + delta);
      }
      for (const [rumorId, patch] of Object.entries(impact.rumors)) {
        const rumor = state.world.rumors[rumorId];
        if (!rumor) continue;
        if (Object.prototype.hasOwnProperty.call(patch, "active")) rumor.active = Boolean(patch.active);
        if (Object.prototype.hasOwnProperty.call(patch, "intensity")) rumor.intensity = clamp((rumor.intensity || 0) + patch.intensity);
        if (Object.prototype.hasOwnProperty.call(patch, "credibility")) rumor.credibility = clamp((rumor.credibility || 0) + patch.credibility);
        rumor.sources = H.Core.Util.unique([...(rumor.sources || []), `第一章：${data.chapter.profileLabel}`]);
        rumor.mutations = rumor.mutations || [];
        rumor.mutations.push({ from: "chapter1_transfer", profile: data.chapter.profile, day: 1, segment: 0 });
      }
      if (!state.world.factions) state.world.factions = {};
      for (const [factionId, patch] of Object.entries(impact.factions)) {
        const faction = state.world.factions[factionId] || { attitude: 0, influence: 40, pressure: 40, memory: [] };
        if (Object.prototype.hasOwnProperty.call(patch, "attitude")) faction.attitude = clamp((faction.attitude || 0) + patch.attitude, -100, 100);
        if (Object.prototype.hasOwnProperty.call(patch, "influence")) faction.influence = clamp((faction.influence || 0) + patch.influence);
        if (Object.prototype.hasOwnProperty.call(patch, "pressure")) faction.pressure = clamp((faction.pressure || 0) + patch.pressure);
        faction.memory = faction.memory || [];
        faction.memory.push({ source: "chapter1", profile: data.chapter.profile, note: impact.label });
        state.world.factions[factionId] = faction;
      }
      const reportBits = [
        `第一章結末「${data.chapter.endingTitle}」を第二章へ継承。`,
        `継承型：${data.chapter.profileLabel}。`,
        `公開方針：${this.reportLabel("policy", data.report?.policy)}。`,
        ...impact.notes,
      ];
      for (const text of reportBits) state.world.eventHistory.push({ text, category: "inheritance", day: 1, segment: 0, mapId: state.player.mapId });
      for (const entry of seriesRecord.recallLog.slice(0, 10)) state.world.eventHistory.push({ text: entry.text, category: `回想:${entry.category}`, day: 1, segment: 0, mapId: state.player.mapId });
      if (state.world.eventHistory.length > 220) state.world.eventHistory.splice(0, state.world.eventHistory.length - 220);
      return { payload: data, impact };
    }

    buildPrologue(payload) {
      const data = this.normalize(payload);
      const impact = this.getImpactProfile(data);
      const reportLine = `${this.reportLabel("cause", data.report?.cause)}／${this.reportLabel("responsible", data.report?.responsible)}／${this.reportLabel("policy", data.report?.policy)}`;
      const rescue = data.readiness.eldRescued ? "エルド救出済み" : "エルド救出は不安定";
      const witness = data.readiness.witnessProtection ? "証人保護済み" : "証人保護は未完";
      const bell = data.readiness.bellRepaired ? "雨鐘修復済み" : "雨鐘は未修復";
      return [
        {
          kicker: "章間ブリーフィング 1/5",
          title: data.chapter.profileLabel,
          body: [
            `${data.player.name}の第一章は、結末「${data.chapter.endingTitle}」として第二章へ引き継がれた。`,
            `正式報告：${reportLine}。この三項目は、第二章の新聞見出し・NPCの警戒・派閥の初期姿勢へ反映される。`,
          ],
        },
        {
          kicker: "章間ブリーフィング 2/5",
          title: "救った者、守れなかった者",
          body: [
            `継承状態：${rescue}、${witness}、${bell}。`,
            "第二章では、真実そのものよりも『その真実を誰が安全に語れるか』が重要になる。保護された証言は道になるが、傷ついた証言は噂の餌になる。",
          ],
        },
        {
          kicker: "章間ブリーフィング 3/5",
          title: "街の初期状態が変化",
          body: [
            `第二章開始時の補正：街の安定 ${impact.stability >= 0 ? "+" : ""}${impact.stability}、市民信頼 ${impact.publicTrust >= 0 ? "+" : ""}${impact.publicTrust}、噂圧 ${impact.rumor >= 0 ? "+" : ""}${impact.rumor}。`,
            impact.notes[0] || "第一章の選択が、NPCの信頼・噂・派閥状態へ反映された。",
          ],
        },
        {
          kicker: "章間ブリーフィング 4/5",
          title: "派閥は過去の記録を読む",
          body: [
            "地図院、市民網、公債商会、監査庁、鋳造組合、噂売りは、第一章の公式記録をそれぞれ別の利益で解釈する。",
            "あなたが残した結末は、誰かにとって盾になり、誰かにとって脅威になり、誰かにとって次の商材になる。",
          ],
        },
        {
          kicker: "第二章　黒雨の帳簿",
          title: "同じ街は、同じ雨を降らせない",
          body: [
            "黒雨は天候ではない。街が前に採用した記録を読み取り、その弱い箇所から染み出している。",
            "巡察記録を開けば、第一章の回想ログと第二章への影響をいつでも確認できる。次に守るべきものは、名前と帳簿だ。",
          ],
        },
      ];
    }

    reportLabel(group, id) {
      const chapter1Options = {
        cause: {
          beast: "灰獣による捕食",
          detention: "巡察隊による違法拘束",
          smuggling: "密売組織の内部抗争",
          compound: "違法拘束と噂災害の複合",
        },
        responsible: {
          dario: "ダリオ巡察長",
          ines: "書記官イネス",
          oren: "噂売りオレン",
          shared: "巡察長と噂網の共同責任",
        },
        policy: {
          immediate: "全記録を即時公開",
          staged: "証人保護後に段階公開",
          sealed: "秩序維持を理由に封印",
          bargain: "巡察隊との取引",
        },
      };
      return chapter1Options[group]?.[id] || id || "未記録";
    }

    summary(payload = null) {
      const data = payload || this.readStored();
      if (!data) return null;
      const impact = this.getImpactProfile(data);
      return {
        name: data.player.name,
        endingTitle: data.chapter.endingTitle,
        profileLabel: data.chapter.profileLabel,
        policy: this.reportLabel("policy", data.report?.policy),
        rescued: Boolean(data.readiness?.eldRescued),
        protected: Boolean(data.readiness?.witnessProtection),
        bell: Boolean(data.readiness?.bellRepaired),
        stability: data.readiness?.stability ?? 0,
        publicTrust: data.readiness?.publicTrust ?? 0,
        deltas: { stability: impact.stability, publicTrust: impact.publicTrust, rumor: impact.rumor },
        notes: impact.notes,
      };
    }
  }

  H.Systems.ChapterTransfer = ChapterTransfer;
})(window.Haimachi);
