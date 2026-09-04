(function registerInputManager(H) {
  "use strict";

  class InputManager {
    constructor(eventBus) {
      this.eventBus = eventBus;
      this.keys = new Set();
      this.justPressed = new Set();
      this.virtual = { x: 0, y: 0, interact: false };
      this.enabled = true;
      this.bindings = {
        up: ["ArrowUp", "KeyW"],
        down: ["ArrowDown", "KeyS"],
        left: ["ArrowLeft", "KeyA"],
        right: ["ArrowRight", "KeyD"],
        interact: ["KeyE", "Space", "Enter"],
        journal: ["KeyJ"],
        evidence: ["KeyV"],
        deduction: ["KeyB"],
        map: ["KeyM"],
        people: ["KeyP"],
        series: ["KeyL"],
        cancel: ["Escape"],
        debug: ["F3"],
      };
      this.onKeyDown = this.onKeyDown.bind(this);
      this.onKeyUp = this.onKeyUp.bind(this);
      window.addEventListener("keydown", this.onKeyDown, { passive: false });
      window.addEventListener("keyup", this.onKeyUp, { passive: false });
      window.addEventListener("blur", () => this.reset());
    }

    onKeyDown(event) {
      if (!this.enabled) return;
      const editable = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      if (editable && event.code !== "Escape") return;
      const first = !this.keys.has(event.code);
      this.keys.add(event.code);
      if (first) {
        this.justPressed.add(event.code);
        const action = this.actionForCode(event.code);
        if (action) this.eventBus?.emit("input:action", { action, source: "keyboard", originalEvent: event });
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(event.code)) event.preventDefault();
    }

    onKeyUp(event) {
      this.keys.delete(event.code);
    }

    actionForCode(code) {
      for (const [action, codes] of Object.entries(this.bindings)) {
        if (codes.includes(code)) return action;
      }
      return null;
    }

    isDown(action) {
      return (this.bindings[action] || []).some((code) => this.keys.has(code));
    }

    consume(action) {
      const code = (this.bindings[action] || []).find((candidate) => this.justPressed.has(candidate));
      if (!code) return false;
      this.justPressed.delete(code);
      return true;
    }

    getMovement() {
      let x = 0;
      let y = 0;
      if (this.isDown("left")) x -= 1;
      if (this.isDown("right")) x += 1;
      if (this.isDown("up")) y -= 1;
      if (this.isDown("down")) y += 1;
      x += this.virtual.x;
      y += this.virtual.y;
      const normalized = H.Core.Util.normalizeVector(x, y);
      return { x: normalized.x, y: normalized.y, active: normalized.length > 0 };
    }

    setVirtualMovement(x, y) {
      const normalized = H.Core.Util.normalizeVector(x, y);
      this.virtual.x = normalized.x;
      this.virtual.y = normalized.y;
    }

    virtualInteract() {
      this.eventBus?.emit("input:action", { action: "interact", source: "touch" });
    }

    setEnabled(enabled) {
      this.enabled = Boolean(enabled);
      if (!this.enabled) this.reset();
    }

    endFrame() {
      this.justPressed.clear();
    }

    reset() {
      this.keys.clear();
      this.justPressed.clear();
      this.virtual.x = 0;
      this.virtual.y = 0;
    }

    destroy() {
      window.removeEventListener("keydown", this.onKeyDown);
      window.removeEventListener("keyup", this.onKeyUp);
      this.reset();
    }
  }

  H.Core.InputManager = InputManager;
})(window.Haimachi);
