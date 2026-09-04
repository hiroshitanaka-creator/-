(function registerTouchControls(H) {
  "use strict";

  const { DOM } = H.UI;

  class TouchControls {
    constructor(game) {
      this.game = game;
      this.root = DOM.id("touchControls");
      this.stick = DOM.id("touchStick");
      this.knob = DOM.id("touchKnob");
      this.pointerId = null;
      this.bind();
    }

    bind() {
      this.stick?.addEventListener("pointerdown", (event) => {
        this.pointerId = event.pointerId;
        this.stick.setPointerCapture(event.pointerId);
        this.updateStick(event);
      });
      this.stick?.addEventListener("pointermove", (event) => {
        if (event.pointerId === this.pointerId) this.updateStick(event);
      });
      const release = (event) => {
        if (event.pointerId !== this.pointerId) return;
        this.pointerId = null;
        this.knob.style.transform = "translate(-50%,-50%)";
        this.game.input.setVirtualMovement(0, 0);
      };
      this.stick?.addEventListener("pointerup", release);
      this.stick?.addEventListener("pointercancel", release);
      DOM.id("touchInteract")?.addEventListener("pointerdown", (event) => { event.preventDefault(); this.game.input.virtualInteract(); });
      DOM.id("touchJournal")?.addEventListener("pointerdown", (event) => { event.preventDefault(); this.game.ui.toggleDrawer("journal"); });
    }

    updateStick(event) {
      const rect = this.stick.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      let dx = event.clientX - cx;
      let dy = event.clientY - cy;
      const radius = rect.width * .34;
      const length = Math.hypot(dx, dy);
      if (length > radius) { dx = dx / length * radius; dy = dy / length * radius; }
      this.knob.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px))`;
      this.game.input.setVirtualMovement(dx / radius, dy / radius);
    }

    setVisible(visible) {
      this.root?.classList.toggle("is-hidden", !visible);
    }
  }

  H.UI.TouchControls = TouchControls;
})(window.Haimachi);
