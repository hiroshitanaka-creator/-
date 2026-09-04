(function registerEvidenceSystem(H) {
  "use strict";

  class EvidenceSystem {
    constructor(game) {
      this.game = game;
    }

    get(id) {
      return H.Data.EvidenceById[id] || null;
    }

    has(id) {
      return this.game.state.evidence.discovered.includes(id);
    }

    discover(id, context = {}) {
      const evidence = this.get(id);
      if (!evidence) {
        console.warn("Unknown evidence", id);
        return false;
      }
      const state = this.game.state;
      if (state.evidence.discovered.includes(id)) return false;
      state.evidence.discovered.push(id);
      state.evidence.discoveryLog.push({
        id,
        day: state.world.day,
        segment: state.world.segment,
        mapId: state.player.mapId,
        source: context.hotspotId || context.npcId || evidence.source,
      });
      this.game.addEvent(`証拠「${evidence.title}」を記録した。`, "evidence");
      this.game.audio.evidence();
      this.game.bus.emit("evidence:discovered", { evidence, context });
      this.game.bus.emit("ui:notify", {
        title: evidence.key ? "重要証拠を記録" : "証拠を記録",
        text: `${evidence.icon || "証"}　${evidence.title} — ${evidence.summary}`,
        icon: evidence.icon || "証",
        tone: evidence.key ? "success" : "normal",
      });
      return true;
    }

    review(id) {
      const evidence = this.get(id);
      if (!evidence || !this.has(id)) return false;
      if (!this.game.state.evidence.reviewed.includes(id)) this.game.state.evidence.reviewed.push(id);
      this.game.bus.emit("evidence:reviewed", { evidence });
      return true;
    }

    discovered() {
      return this.game.state.evidence.discovered.map((id) => this.get(id)).filter(Boolean);
    }

    byCategory(category) {
      const list = this.discovered();
      return category === "all" ? list : list.filter((entry) => entry.category === category);
    }
  }

  H.Systems.EvidenceSystem = EvidenceSystem;
})(window.Haimachi);
