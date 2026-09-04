(function registerEventBus(H) {
  "use strict";

  class EventBus {
    constructor() {
      this.listeners = new Map();
      this.anyListeners = new Set();
    }

    on(eventName, callback) {
      if (typeof callback !== "function") throw new TypeError("EventBus.on requires a function.");
      if (!this.listeners.has(eventName)) this.listeners.set(eventName, new Set());
      this.listeners.get(eventName).add(callback);
      return () => this.off(eventName, callback);
    }

    once(eventName, callback) {
      const unsubscribe = this.on(eventName, (...args) => {
        unsubscribe();
        callback(...args);
      });
      return unsubscribe;
    }

    onAny(callback) {
      this.anyListeners.add(callback);
      return () => this.anyListeners.delete(callback);
    }

    off(eventName, callback) {
      const group = this.listeners.get(eventName);
      if (!group) return false;
      const removed = group.delete(callback);
      if (group.size === 0) this.listeners.delete(eventName);
      return removed;
    }

    emit(eventName, payload = undefined) {
      const group = this.listeners.get(eventName);
      if (group) {
        for (const callback of Array.from(group)) {
          try {
            callback(payload, eventName);
          } catch (error) {
            console.error(`[EventBus] listener failed for ${eventName}`, error);
          }
        }
      }
      for (const callback of Array.from(this.anyListeners)) {
        try {
          callback(eventName, payload);
        } catch (error) {
          console.error(`[EventBus] any-listener failed for ${eventName}`, error);
        }
      }
    }

    clear(eventName = null) {
      if (eventName == null) {
        this.listeners.clear();
        this.anyListeners.clear();
      } else {
        this.listeners.delete(eventName);
      }
    }
  }

  H.Core.EventBus = EventBus;
})(window.Haimachi);
