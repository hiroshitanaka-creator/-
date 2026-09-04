(function registerRNG(H) {
  "use strict";

  class SeededRNG {
    constructor(seed = Date.now()) {
      this.seed = SeededRNG.normalizeSeed(seed);
      this.state = this.seed || 0x6d2b79f5;
    }

    static normalizeSeed(seed) {
      if (typeof seed === "number" && Number.isFinite(seed)) return seed >>> 0;
      const text = String(seed ?? "haimachi");
      let result = 2166136261;
      for (let index = 0; index < text.length; index += 1) {
        result ^= text.charCodeAt(index);
        result = Math.imul(result, 16777619);
      }
      return result >>> 0;
    }

    next() {
      let t = this.state += 0x6d2b79f5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      this.state >>>= 0;
      return value;
    }

    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    }

    float(min, max) {
      return min + this.next() * (max - min);
    }

    chance(probability) {
      return this.next() < probability;
    }

    pick(items) {
      if (!items || items.length === 0) return undefined;
      return items[this.int(0, items.length - 1)];
    }

    weighted(entries) {
      const total = entries.reduce((sum, entry) => sum + Math.max(0, entry.weight), 0);
      if (total <= 0) return entries[0]?.value;
      let roll = this.float(0, total);
      for (const entry of entries) {
        roll -= Math.max(0, entry.weight);
        if (roll <= 0) return entry.value;
      }
      return entries[entries.length - 1]?.value;
    }

    shuffle(items) {
      const copy = items.slice();
      for (let index = copy.length - 1; index > 0; index -= 1) {
        const target = this.int(0, index);
        [copy[index], copy[target]] = [copy[target], copy[index]];
      }
      return copy;
    }

    snapshot() {
      return { seed: this.seed, state: this.state };
    }

    restore(snapshot) {
      if (!snapshot) return;
      this.seed = SeededRNG.normalizeSeed(snapshot.seed);
      this.state = SeededRNG.normalizeSeed(snapshot.state);
    }
  }

  H.Core.SeededRNG = SeededRNG;
})(window.Haimachi);
