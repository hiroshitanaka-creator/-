(function registerSaveManager(H) {
  "use strict";

  const { StateFactory, Util } = H.Core;

  class SaveManager {
    constructor(eventBus) {
      this.eventBus = eventBus;
      this.prefix = "haimachi-chapter2";
      this.autoSlot = `${this.prefix}:autosave`;
      this.manualSlot = `${this.prefix}:manual`;
      this.settingsKey = `${this.prefix}:settings`;
      this.lastAutoSaveAt = 0;
      this.autoTimer = null;
    }

    hasSave() {
      return Boolean(localStorage.getItem(this.autoSlot) || localStorage.getItem(this.manualSlot));
    }

    getSummary() {
      const raw = localStorage.getItem(this.autoSlot) || localStorage.getItem(this.manualSlot);
      if (!raw) return null;
      try {
        const parsed = JSON.parse(raw);
        return {
          name: parsed.player?.name || "不明",
          day: parsed.world?.day || 1,
          segment: parsed.world?.segment || 0,
          mapId: parsed.player?.mapId || "map_archive",
          playtimeSeconds: parsed.meta?.playtimeSeconds || 0,
          updatedAt: parsed.meta?.updatedAt || null,
          chapterComplete: Boolean(parsed.world?.flags?.chapter_complete),
        };
      } catch (error) {
        console.warn("Failed to read save summary", error);
        return null;
      }
    }

    save(state, slot = "auto", reason = "") {
      const key = slot === "manual" ? this.manualSlot : this.autoSlot;
      const copy = Util.deepClone(state);
      copy.paused = true;
      StateFactory.refreshChecksum(copy);
      try {
        localStorage.setItem(key, JSON.stringify(copy));
        this.lastAutoSaveAt = performance.now();
        this.eventBus?.emit("save:completed", { slot, reason, at: copy.meta.updatedAt });
        return true;
      } catch (error) {
        console.error("Save failed", error);
        this.eventBus?.emit("save:failed", { slot, reason, error });
        return false;
      }
    }

    autoSave(state, reason = "progress") {
      if (!state.settings.autoSave) return false;
      return this.save(state, "auto", reason);
    }

    scheduleAutoSave(state, reason = "progress", delay = 350) {
      if (!state?.settings?.autoSave) return false;
      clearTimeout(this.autoTimer);
      this.autoTimer = setTimeout(() => this.autoSave(state, reason), delay);
      return true;
    }

    load(preferred = "auto") {
      const keys = preferred === "manual"
        ? [this.manualSlot, this.autoSlot]
        : [this.autoSlot, this.manualSlot];
      let lastError = null;
      for (const key of keys) {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        try {
          const parsed = JSON.parse(raw);
          return StateFactory.normalizeLoaded(parsed);
        } catch (error) {
          lastError = error;
          console.error(`Failed to load ${key}`, error);
        }
      }
      if (lastError) throw lastError;
      return null;
    }

    deleteAll() {
      localStorage.removeItem(this.autoSlot);
      localStorage.removeItem(this.manualSlot);
      this.eventBus?.emit("save:deleted");
    }

    export(state) {
      const copy = Util.deepClone(state);
      StateFactory.refreshChecksum(copy);
      const date = new Date().toISOString().slice(0, 10);
      Util.downloadJSON(`灰街巡察記録_${copy.player.name}_${date}.json`, copy);
      this.eventBus?.emit("save:exported");
    }

    async import(file) {
      const text = await Util.readFileText(file);
      const parsed = JSON.parse(text);
      const normalized = StateFactory.normalizeLoaded(parsed);
      this.save(normalized, "manual", "import");
      this.eventBus?.emit("save:imported");
      return normalized;
    }

    saveSettings(settings) {
      try {
        localStorage.setItem(this.settingsKey, JSON.stringify(settings));
      } catch (error) {
        console.warn("Could not persist settings", error);
      }
    }

    loadSettings() {
      try {
        const raw = localStorage.getItem(this.settingsKey);
        return raw ? JSON.parse(raw) : null;
      } catch (error) {
        return null;
      }
    }
  }

  H.Core.SaveManager = SaveManager;
})(window.Haimachi);
