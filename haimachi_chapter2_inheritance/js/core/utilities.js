(function registerUtilities(H) {
  "use strict";

  const Util = {
    clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    },

    lerp(a, b, t) {
      return a + (b - a) * t;
    },

    invLerp(a, b, value) {
      if (a === b) return 0;
      return Util.clamp((value - a) / (b - a), 0, 1);
    },

    mapRange(value, inMin, inMax, outMin, outMax) {
      return Util.lerp(outMin, outMax, Util.invLerp(inMin, inMax, value));
    },

    distance(a, b) {
      const dx = a.x - b.x;
      const dy = a.y - b.y;
      return Math.hypot(dx, dy);
    },

    distanceXY(ax, ay, bx, by) {
      return Math.hypot(ax - bx, ay - by);
    },

    normalizeVector(x, y) {
      const length = Math.hypot(x, y);
      if (length < 0.00001) return { x: 0, y: 0, length: 0 };
      return { x: x / length, y: y / length, length };
    },

    circleRectOverlap(cx, cy, radius, rect) {
      const nearestX = Util.clamp(cx, rect.x, rect.x + rect.w);
      const nearestY = Util.clamp(cy, rect.y, rect.y + rect.h);
      const dx = cx - nearestX;
      const dy = cy - nearestY;
      return dx * dx + dy * dy < radius * radius;
    },

    pointInRect(x, y, rect) {
      return x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
    },

    rectsOverlap(a, b) {
      return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    },

    deepClone(value) {
      if (globalThis.structuredClone) return globalThis.structuredClone(value);
      return JSON.parse(JSON.stringify(value));
    },

    unique(items) {
      return Array.from(new Set(items));
    },

    removeFromArray(items, value) {
      const index = items.indexOf(value);
      if (index >= 0) items.splice(index, 1);
      return index >= 0;
    },

    ensureArray(value) {
      if (Array.isArray(value)) return value;
      if (value == null) return [];
      return [value];
    },

    toMap(items, key = "id") {
      const result = {};
      for (const item of items) result[item[key]] = item;
      return result;
    },

    weightedAverage(entries) {
      let weighted = 0;
      let weight = 0;
      for (const entry of entries) {
        weighted += entry.value * entry.weight;
        weight += entry.weight;
      }
      return weight > 0 ? weighted / weight : 0;
    },

    safeNumber(value, fallback = 0) {
      const number = Number(value);
      return Number.isFinite(number) ? number : fallback;
    },

    slug(text) {
      return String(text)
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff]+/g, "-")
        .replace(/^-+|-+$/g, "");
    },

    escapeHTML(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    },

    multiline(text) {
      return Util.escapeHTML(text).replace(/\n/g, "<br>");
    },

    formatDay(day) {
      const kanji = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十"];
      if (day >= 0 && day <= 10) return `${kanji[day]}日目`;
      return `${day}日目`;
    },

    segmentName(segment) {
      return ["朝", "昼", "夕", "夜"][Util.clamp(segment, 0, 3)] || "夜";
    },

    formatClock(day, segment) {
      return `${Util.formatDay(day)}・${Util.segmentName(segment)}`;
    },

    formatPlaytime(seconds) {
      const total = Math.max(0, Math.floor(seconds || 0));
      const hours = Math.floor(total / 3600);
      const minutes = Math.floor((total % 3600) / 60);
      const secs = total % 60;
      if (hours > 0) return `${hours}時間${String(minutes).padStart(2, "0")}分`;
      return `${minutes}分${String(secs).padStart(2, "0")}秒`;
    },

    getByPath(object, path, fallback = undefined) {
      const parts = Array.isArray(path) ? path : String(path).split(".");
      let current = object;
      for (const part of parts) {
        if (current == null || !Object.prototype.hasOwnProperty.call(current, part)) return fallback;
        current = current[part];
      }
      return current;
    },

    setByPath(object, path, value) {
      const parts = Array.isArray(path) ? path : String(path).split(".");
      let current = object;
      for (let index = 0; index < parts.length - 1; index += 1) {
        const part = parts[index];
        if (!current[part] || typeof current[part] !== "object") current[part] = {};
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
      return object;
    },

    adjustByPath(object, path, delta, min = -Infinity, max = Infinity) {
      const current = Util.safeNumber(Util.getByPath(object, path, 0), 0);
      const next = Util.clamp(current + delta, min, max);
      Util.setByPath(object, path, next);
      return next;
    },

    compare(actual, operator, expected) {
      switch (operator) {
        case "eq": return actual === expected;
        case "neq": return actual !== expected;
        case "gt": return actual > expected;
        case "gte": return actual >= expected;
        case "lt": return actual < expected;
        case "lte": return actual <= expected;
        case "includes": return Array.isArray(actual) ? actual.includes(expected) : String(actual).includes(String(expected));
        case "notIncludes": return Array.isArray(actual) ? !actual.includes(expected) : !String(actual).includes(String(expected));
        case "truthy": return Boolean(actual);
        case "falsy": return !actual;
        default: return actual === expected;
      }
    },

    uid(prefix = "id") {
      const random = Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
      return `${prefix}-${Date.now().toString(36)}-${random}`;
    },

    downloadText(filename, text, mime = "text/plain;charset=utf-8") {
      const blob = new Blob([text], { type: mime });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 500);
    },

    downloadJSON(filename, value) {
      Util.downloadText(filename, JSON.stringify(value, null, 2), "application/json;charset=utf-8");
    },

    readFileText(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error || new Error("ファイルを読み込めませんでした。"));
        reader.readAsText(file);
      });
    },

    debounce(fn, wait = 100) {
      let timeout = null;
      return function debounced(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn.apply(this, args), wait);
      };
    },

    throttle(fn, wait = 100) {
      let last = 0;
      let queued = null;
      return function throttled(...args) {
        const now = performance.now();
        const remaining = wait - (now - last);
        if (remaining <= 0) {
          clearTimeout(queued);
          queued = null;
          last = now;
          fn.apply(this, args);
        } else if (!queued) {
          queued = setTimeout(() => {
            queued = null;
            last = performance.now();
            fn.apply(this, args);
          }, remaining);
        }
      };
    },

    wrapText(ctx, text, maxWidth) {
      const words = String(text).split("");
      const lines = [];
      let line = "";
      for (const word of words) {
        const test = line + word;
        if (ctx.measureText(test).width > maxWidth && line) {
          lines.push(line);
          line = word;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines;
    },

    stableHash(value) {
      const text = typeof value === "string" ? value : JSON.stringify(value);
      let hash = 2166136261;
      for (let index = 0; index < text.length; index += 1) {
        hash ^= text.charCodeAt(index);
        hash = Math.imul(hash, 16777619);
      }
      return (hash >>> 0).toString(16).padStart(8, "0");
    },
  };

  H.Core.Util = Util;
})(window.Haimachi);
