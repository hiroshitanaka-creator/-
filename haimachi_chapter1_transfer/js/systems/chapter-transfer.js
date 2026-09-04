(function registerChapterTransfer(H) {
  "use strict";

  const TRANSFER_TYPE = "haimachi.chapter1.transfer";
  const TRANSFER_SCHEMA = 1;
  const SERIES_KEY = "haimachi-series:chapter1-transfer";
  const LOCAL_KEY = "haimachi-chapter1:transfer";
  const REQUIRED_DEDUCTIONS = [
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

  const cloneWithoutChecksum = (value) => {
    const copy = H.Core.Util.deepClone(value);
    delete copy.checksum;
    return copy;
  };

  class ChapterTransfer {
    constructor(game) {
      this.game = game;
      this.seriesKey = SERIES_KEY;
      this.localKey = LOCAL_KEY;
    }

    canExport(state = this.game.state) {
      return Boolean(state?.world?.flags?.chapter_complete && state?.world?.report && state?.world?.endingId);
    }

    build(state = this.game.state) {
      const Util = H.Core.Util;
      if (!state || typeof state !== "object") throw new Error("巡察状態を確認できません。");
      const flags = state.world?.flags || {};
      const report = state.world?.report || null;
      const endingId = state.world?.endingId || null;
      const ending = H.Data.EndingById?.[endingId] || H.Data.Endings?.find((entry) => entry.id === endingId) || null;
      const solved = new Set(state.deductions?.solved || []);
      const readiness = {
        eldRescued: Boolean(flags.eld_rescued),
        witnessProtection: Boolean(flags.witness_protection_ready),
        bellRepaired: Boolean(flags.rain_bell_repaired),
        solvedKey: REQUIRED_DEDUCTIONS.filter((id) => solved.has(id)).length,
        requiredKey: REQUIRED_DEDUCTIONS.length,
        evidenceCount: state.evidence?.discovered?.length || 0,
        stability: Math.round(state.world?.stability ?? 0),
        publicTrust: Math.round(state.world?.publicTrust ?? 0),
        northFear: Math.round(state.world?.districts?.north?.fear ?? 0),
      };
      const profile = this.classify({ endingId, report, readiness, flags, solved });
      const npcTrust = {};
      for (const id of ["naira", "eld", "ines", "dario", "oren", "lo", "mirei", "sena", "baldo"]) {
        if (state.npcs?.[id]) npcTrust[id] = Math.round(state.npcs[id].trust ?? 0);
      }
      const payload = {
        type: TRANSFER_TYPE,
        schemaVersion: TRANSFER_SCHEMA,
        sourceChapter: 1,
        targetChapter: 2,
        createdAt: new Date().toISOString(),
        sourceVersion: H.VERSION,
        player: {
          name: state.player?.name || "レイ",
          rank: state.player?.rank || "巡察記録官",
          level: state.player?.level || 1,
          stats: Util.deepClone(state.player?.stats || {}),
          currencies: Util.deepClone(state.player?.currencies || {}),
        },
        chapter: {
          complete: Boolean(flags.chapter_complete),
          endingId,
          endingTitle: ending?.title || endingId || "未確定",
          profile,
          profileLabel: PROFILE_LABEL[profile] || "第一章記録",
          day: state.world?.day || 1,
          segment: state.world?.segment || 0,
          playtimeSeconds: state.meta?.playtimeSeconds || 0,
        },
        report: report ? {
          cause: report.cause || null,
          responsible: report.responsible || null,
          policy: report.policy || null,
          note: report.note || "",
          submittedAt: Util.deepClone(report.submittedAt || null),
        } : null,
        readiness,
        facts: {
          eldRescued: Boolean(flags.eld_rescued),
          witnessProtectionReady: Boolean(flags.witness_protection_ready),
          rainBellRepaired: Boolean(flags.rain_bell_repaired),
          inesConfessed: Boolean(flags.ines_confessed),
          inesWhistleblowerProven: Boolean(flags.ines_whistleblower_proven),
          darioCommandProven: Boolean(flags.dario_command_proven),
          graySaltMechanismProven: solved.has("d_gray_salt_mechanism") || Boolean(flags.gray_salt_mechanism_proven),
          completeCaseSolved: solved.has("d_complete_case"),
          reportUnlocked: Boolean(flags.report_unlocked),
        },
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
          districtSnapshot: Util.deepClone(state.world?.districts || {}),
        },
        carryover: this.carryoverTags(profile, report, readiness, flags),
        checksum: "",
      };
      payload.checksum = this.checksum(payload);
      return payload;
    }

    classify({ endingId, report, readiness }) {
      if (PROFILE_BY_ENDING[endingId]) return PROFILE_BY_ENDING[endingId];
      if (report?.cause === "beast") return "false_beast";
      if (report?.responsible === "ines") return "scapegoat_ines";
      if (report?.policy === "bargain") return "bargain_order";
      if (report?.policy === "sealed") return "sealed_order";
      if (readiness.solvedKey >= readiness.requiredKey && report?.policy === "staged") return "true_map";
      return "partial_case";
    }

    carryoverTags(profile, report, readiness, flags) {
      const tags = [profile];
      if (report?.policy) tags.push(`policy:${report.policy}`);
      if (report?.responsible) tags.push(`responsible:${report.responsible}`);
      if (readiness.eldRescued) tags.push("eld_rescued");
      else tags.push("eld_not_secured");
      if (readiness.witnessProtection) tags.push("witness_protected");
      else tags.push("witness_exposed");
      if (readiness.bellRepaired) tags.push("rain_bell_repaired");
      if (flags.ines_confessed) tags.push("ines_confessed");
      return tags;
    }

    checksum(payload) {
      return H.Core.Util.stableHash(cloneWithoutChecksum(payload));
    }

    validate(payload) {
      if (!payload || payload.type !== TRANSFER_TYPE) return { ok: false, error: "第一章継承データではありません。" };
      if (payload.sourceChapter !== 1 || payload.targetChapter !== 2) return { ok: false, error: "章の組み合わせが一致しません。" };
      if (!payload.chapter?.complete) return { ok: false, error: "第一章の正式報告後のデータではありません。" };
      const expected = this.checksum(payload);
      if (payload.checksum && payload.checksum !== expected) return { ok: false, error: "継承データのチェックサムが一致しません。" };
      return { ok: true };
    }

    persist(state = this.game.state) {
      if (!this.canExport(state)) return { success: false, error: "第一章の正式報告を終えると、第二章への継承データを書き出せます。" };
      const payload = this.build(state);
      const check = this.validate(payload);
      if (!check.ok) return { success: false, error: check.error, payload };
      try {
        if (typeof localStorage !== "undefined") {
          localStorage.setItem(this.seriesKey, JSON.stringify(payload));
          localStorage.setItem(this.localKey, JSON.stringify(payload));
        }
      } catch (error) {
        return { success: false, error: `ブラウザ内保存に失敗しました: ${error.message}`, payload };
      }
      this.game.bus?.emit("transfer:persisted", { payload });
      return { success: true, payload };
    }

    exportChapter2Transfer(state = this.game.state) {
      const result = this.persist(state);
      if (!result.payload && !result.success) return result;
      if (!result.success && !result.payload) return result;
      const payload = result.payload;
      const date = new Date().toISOString().slice(0, 10);
      const profile = payload.chapter.profileLabel.replace(/[\\/:*?"<>|\s]+/g, "_");
      H.Core.Util.downloadJSON(`灰街_第一章から第二章へ_${payload.player.name}_${profile}_${date}.json`, payload);
      this.game.bus?.emit("transfer:exported", { payload });
      return { ...result, success: true, payload };
    }

    getStored() {
      if (typeof localStorage === "undefined") return null;
      for (const key of [this.seriesKey, this.localKey]) {
        try {
          const raw = localStorage.getItem(key);
          if (!raw) continue;
          const payload = JSON.parse(raw);
          if (this.validate(payload).ok) return payload;
        } catch (error) {
          console.warn("Invalid stored chapter transfer", error);
        }
      }
      return null;
    }

    summary(payload = null) {
      const data = payload || this.getStored() || (this.canExport() ? this.build() : null);
      if (!data) return "第一章の正式報告後に、第二章への継承データを作成できます。";
      return `${data.player.name}／${data.chapter.profileLabel}／結末「${data.chapter.endingTitle}」／街の安定 ${data.readiness.stability}／信頼 ${data.readiness.publicTrust}`;
    }
  }

  H.Systems.ChapterTransfer = ChapterTransfer;
})(window.Haimachi);
