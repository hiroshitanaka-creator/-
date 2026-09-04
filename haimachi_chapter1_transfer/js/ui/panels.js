(function registerPanelRenderer(H) {
  "use strict";

  const { Util } = H.Core;

  class PanelRenderer {
    constructor(game) {
      this.game = game;
      this.evidenceDetailId = null;
    }

    render(panel) {
      switch (panel) {
        case "journal": return this.journal();
        case "evidence": return this.evidence();
        case "map": return this.map();
        case "people": return this.people();
        case "settings": return this.settings();
        default: return "";
      }
    }

    journal() {
      const state = this.game.state;
      const activeQuests = H.Data.Quests.filter((quest) => ["active", "complete"].includes(state.quests[quest.id]?.status));
      const rumorCards = Object.entries(state.world.rumors).filter(([, rumor]) => rumor.active).map(([id, rumor]) => {
        const source = H.Data.Config.initialRumors.find((entry) => entry.id === id);
        return `<article class="rumor-card">
          <header><h4>${Util.escapeHTML(source?.title || id)}</h4><span class="status-pill ${rumor.countered ? "status-positive" : rumor.intensity > 65 ? "status-danger" : "status-warning"}">${rumor.countered ? "沈静" : `強度 ${Math.round(rumor.intensity)}`}</span></header>
          <p>${Util.escapeHTML(source?.statement || "")}</p>
          <div class="rumor-meter"><div class="meter danger"><i style="width:${rumor.intensity}%"></i></div><b>信用 ${Math.round(rumor.credibility)}</b></div>
          <div class="rumor-sources">${(rumor.sources || []).map((item) => `<span>${Util.escapeHTML(item)}</span>`).join("")}</div>
        </article>`;
      }).join("");
      const questCards = activeQuests.map((quest) => {
        const q = state.quests[quest.id];
        const stage = quest.stages[Math.min(q.currentStage, quest.stages.length - 1)];
        const objectives = stage?.objectives || [];
        const completeCount = objectives.filter((objective) => q.completedObjectives.includes(objective.id)).length;
        const progress = objectives.length ? completeCount / objectives.length * 100 : 100;
        return `<article class="quest-card is-${quest.type}">
          <header><h4>${Util.escapeHTML(quest.title)}</h4><span class="status-pill ${q.status === "complete" ? "status-positive" : "status-neutral"}">${q.status === "complete" ? "完了" : quest.type === "main" ? "主要事件" : "追加巡察"}</span></header>
          <p>${Util.escapeHTML(q.status === "complete" ? (quest.rewardsText || quest.summary) : (stage?.description || quest.summary))}</p>
          <div class="quest-progress"><i style="width:${progress}%"></i></div>
          ${q.status === "active" ? `<div class="objective-list">${objectives.map((objective) => `<div class="objective-item ${q.completedObjectives.includes(objective.id) ? "is-complete" : ""}"><span class="objective-mark">${q.completedObjectives.includes(objective.id) ? "✓" : "·"}</span><span><b>${Util.escapeHTML(objective.text)}</b><small>${objective.optional ? "任意目標" : "必要目標"}</small></span>${objective.rewardText ? `<span class="objective-reward">${Util.escapeHTML(objective.rewardText)}</span>` : ""}</div>`).join("")}</div>` : ""}
        </article>`;
      }).join("");
      const history = state.world.eventHistory.slice(-18).reverse().map((entry) => `<article class="history-card" style="padding:.62rem"><small>${Util.formatClock(entry.day, entry.segment)}・${Util.escapeHTML(entry.category || "記録")}</small><div>${Util.escapeHTML(entry.text)}</div></article>`).join("");
      return `
        <div class="section-heading"><div><p class="eyebrow">巡察状況</p><h3>${Util.escapeHTML(H.Data.Config.chapter)}</h3></div><p>${Util.formatPlaytime(state.meta.playtimeSeconds)}</p></div>
        <div class="stats-grid">
          <div class="stat-card"><span>街の安定</span><b>${Math.round(state.world.stability)}</b><small>25未満で危険域</small></div>
          <div class="stat-card"><span>市民信頼</span><b>${Math.round(state.world.publicTrust)}</b><small>公開後の反応に影響</small></div>
          <div class="stat-card"><span>証拠</span><b>${state.evidence.discovered.length}/32</b><small>重要証拠を含む</small></div>
          <div class="stat-card"><span>成立推理</span><b>${state.deductions.solved.length}/9</b><small>真相の固定度</small></div>
        </div>
        <div class="section-heading" style="margin-top:1rem"><h3>任務</h3><p>調査順は自由です</p></div>
        <div class="quest-list">${questCards || `<div class="empty-state">ナイラから任務を受けてください。</div>`}</div>
        <div class="section-heading" style="margin-top:1rem"><h3>街を流れる噂</h3><p>時間経過で変化</p></div>
        <div class="rumor-list">${rumorCards || `<div class="empty-state">活性化した噂はありません。</div>`}</div>
        <div class="section-heading" style="margin-top:1rem"><h3>最近の巡察記録</h3></div>
        <div class="history-list">${history || `<div class="empty-state">まだ記録はありません。</div>`}</div>`;
    }

    evidence() {
      const state = this.game.state;
      const categories = [
        ["all", "すべて"], ["physical", "物証"], ["document", "文書"], ["testimony", "証言"], ["material", "試料"],
      ];
      const filter = state.ui.evidenceFilter || "all";
      const list = this.game.evidence.byCategory(filter);
      const detail = this.evidenceDetailId ? H.Data.EvidenceById[this.evidenceDetailId] : null;
      return `<div class="evidence-toolbar">
        <div class="filter-group">${categories.map(([id, label]) => `<button class="filter-button ${filter === id ? "is-active" : ""}" data-evidence-filter="${id}">${label}</button>`).join("")}</div>
        <span class="status-pill status-neutral">${list.length}件</span>
      </div>
      ${detail && state.evidence.discovered.includes(detail.id) ? `<article class="evidence-detail"><p class="eyebrow">${Util.escapeHTML(detail.source)}</p><h3>${detail.icon}　${Util.escapeHTML(detail.title)}</h3><p>${Util.escapeHTML(detail.detail)}</p>${detail.quote ? `<blockquote>${Util.escapeHTML(detail.quote)}</blockquote>` : ""}<div class="evidence-tags">${detail.tags.map((tag) => `<span>${Util.escapeHTML(tag)}</span>`).join("")}</div><button class="button button-ghost" data-evidence-detail-close>一覧へ戻る</button></article>` : `<div class="evidence-grid">${list.map((entry) => `<article class="evidence-card ${entry.key ? "is-key" : ""} ${state.evidence.reviewed.includes(entry.id) ? "" : "is-new"}" data-evidence-id="${entry.id}"><header><span class="evidence-icon">${entry.icon}</span><div><small>${Util.escapeHTML(entry.source)}</small><h4>${Util.escapeHTML(entry.title)}</h4></div></header><p>${Util.escapeHTML(entry.summary)}</p><div class="evidence-tags">${entry.tags.slice(0,4).map((tag) => `<span>${Util.escapeHTML(tag)}</span>`).join("")}</div></article>`).join("") || `<div class="empty-state">この分類の証拠はまだありません。現場を歩き、人物へ話しかけてください。</div>`}</div>`}`;
    }

    people() {
      const state = this.game.state;
      return `<div class="people-toolbar"><p>人物は真実・嘘・誤解・保護意図を別々に持ちます。</p><span class="status-pill status-neutral">${H.Data.NPCs.length}人</span></div>
      <div class="people-grid">${H.Data.NPCs.map((npc) => {
        const ns = state.npcs[npc.id];
        const known = ns.memory.length > 0 || npc.id === "naira" || state.world.districts[H.Data.Maps[ns.mapId]?.district]?.visited;
        const map = H.Data.Maps[ns.mapId];
        return `<article class="person-card"><div class="person-avatar" style="background:linear-gradient(145deg,${npc.palette?.[0] || "#aaa"},${npc.palette?.[1] || "#555"})">${known ? npc.glyph : "?"}</div><div><h4>${known ? Util.escapeHTML(npc.name) : "未確認人物"}</h4><p>${known ? Util.escapeHTML(npc.role) : "調査中"}</p><div class="trust-line"><span>信頼</span><div class="meter brass"><i style="width:${known ? ns.trust : 0}%"></i></div><b>${known ? Math.round(ns.trust) : "—"}</b></div><p>${known ? Util.escapeHTML(npc.publicFace) : "街を巡察すると情報が増える。"}</p><div class="person-topics">${known ? npc.topics.map((tag) => `<span>#${Util.escapeHTML(tag)}</span>`).join("") : ""}</div><small>${known && map ? `現在地：${Util.escapeHTML(map.name)}` : ""}</small></div></article>`;
      }).join("")}</div>`;
    }

    map() {
      const state = this.game.state;
      const positions = {
        map_archive: [24, 75], central_plaza: [48, 53], north_market: [47, 20], riverside: [76, 58], watch_house: [68, 35], old_waterworks: [79, 84],
      };
      const routes = [
        ["map_archive","central_plaza"], ["central_plaza","north_market"], ["central_plaza","riverside"], ["central_plaza","watch_house"], ["riverside","old_waterworks"],
      ];
      const svg = routes.map(([a,b]) => {
        const p1=positions[a],p2=positions[b];
        const unlocked=state.world.unlockedMaps.includes(a)&&state.world.unlockedMaps.includes(b);
        return `<path d="M ${p1[0]} ${p1[1]} L ${p2[0]} ${p2[1]}" style="opacity:${unlocked?1:.18}"/>`;
      }).join("");
      return `<div class="map-toolbar"><p>解放済みの地点へは1区分を使って移動できます。</p><span class="status-pill status-neutral">${state.world.unlockedMaps.length}/6地点</span></div>
      <div class="map-board"><svg class="map-routes" viewBox="0 0 100 100" preserveAspectRatio="none">${svg}</svg>${H.Data.MapList.map((map) => {
        const p=positions[map.id]||[50,50]; const unlocked=state.world.unlockedMaps.includes(map.id); const current=state.player.mapId===map.id; const d=state.world.districts[map.district];
        return `<button class="map-node ${current?"is-current":""} ${unlocked?"":"is-locked"}" style="left:${p[0]}%;top:${p[1]}%" data-travel-map="${map.id}" ${unlocked&&!current?"":"disabled"}><b>${Util.escapeHTML(map.name.includes("・") ? map.name.split("・").slice(1).join("・") : map.name)}</b><small>${unlocked?`恐怖 ${Math.round(d?.fear||0)} / 噂 ${Math.round(d?.rumorPressure||0)}`:"線が消えている"}</small></button>`;
      }).join("")}</div><div class="map-legend"><span class="tag">現在地</span><span class="tag">点線＝移動経路</span><span class="tag">旧水路は推理で復元</span></div>`;
    }

    settings() {
      const s = this.game.state.settings;
      return `<div class="settings-groups">
        <section class="settings-group"><h3>音と表示</h3>
          ${this.toggle("music", "環境音・音楽", s.music)}${this.toggle("sound", "効果音", s.sound)}${this.toggle("rainOverlay", "雨の前景演出", s.rainOverlay)}${this.toggle("brightExploration", "明るい探索表示", s.brightExploration !== false)}${this.toggle("reducedMotion", "動きを減らす", s.reducedMotion)}${this.toggle("highContrast", "高コントラスト", s.highContrast)}${this.toggle("fontLarge", "文字を大きくする", s.fontLarge)}
          <label class="setting-row"><span><b>音量</b><small>0〜100%</small></span><input type="range" min="0" max="1" step="0.05" value="${s.volume}" data-setting-range="volume"></label>
        </section>
        <section class="settings-group"><h3>調査支援</h3>${this.toggle("showHints", "推理失敗時のヒント", s.showHints)}${this.toggle("autoSave", "オートセーブ", s.autoSave)}<p>現在の難易度：<b>${H.Data.Config.difficulty[s.difficulty].label}</b>（途中変更不可）</p></section>
        <section class="settings-group"><h3>巡察記録</h3><div class="settings-actions"><button class="button button-primary" data-save-manual>手動セーブ</button><button class="button button-secondary" data-load-save>ロード</button><button class="button button-secondary" data-export-save>書き出す</button><label class="button button-secondary" style="display:inline-flex;align-items:center">読み込む<input type="file" accept="application/json" data-import-save hidden></label><button class="button button-ghost" data-return-title>タイトルへ戻る</button><button class="button button-ghost" data-delete-save>全セーブ削除</button></div></section>
        <section class="settings-group"><h3>第二章への継承</h3><p>第一章の結末、救出状況、証人保護、公開方針だけを安全な継承データへ要約します。第二章はこの要約を読み、初期信頼・噂圧・派閥状態へ反映します。</p><div class="settings-actions"><button class="button button-primary" data-export-chapter-transfer>第二章継承データを書き出す</button><button class="button button-secondary" data-proceed-chapter2>第二章へ進む</button></div><p><small>${Util.escapeHTML(this.game.transfer?.summary?.() || "正式報告後に作成できます。")}</small></p></section>
        <section class="settings-group"><h3>MCP拡張境界</h3><p>正式状態はゲームロジックが所有します。外部AI/MCPは記憶・噂・事件候補を提出できますが、任意の状態書換えは拒否されます。</p><code>window.haimachiMCP.getResourceSnapshot()</code></section>
      </div>`;
    }

    toggle(key, label, value) {
      return `<label class="setting-row"><span><b>${label}</b><small>${value ? "有効" : "無効"}</small></span><input type="checkbox" data-setting="${key}" ${value ? "checked" : ""}></label>`;
    }
  }

  H.UI.PanelRenderer = PanelRenderer;
})(window.Haimachi);
