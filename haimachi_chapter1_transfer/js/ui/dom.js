(function registerDOMHelpers(H) {
  "use strict";

  const DOM = {
    id(id) { return document.getElementById(id); },
    one(selector, root = document) { return root.querySelector(selector); },
    all(selector, root = document) { return Array.from(root.querySelectorAll(selector)); },
    show(element, displayClass = "is-visible") {
      if (!element) return;
      element.classList.remove("is-hidden");
      element.classList.add(displayClass);
      element.setAttribute("aria-hidden", "false");
    },
    hide(element, displayClass = "is-visible") {
      if (!element) return;
      element.classList.remove(displayClass);
      element.setAttribute("aria-hidden", "true");
    },
    setText(element, value) { if (element) element.textContent = value ?? ""; },
    setHTML(element, value) { if (element) element.innerHTML = value ?? ""; },
    escape(value) { return H.Core.Util.escapeHTML(value); },
    percent(value, max = 100) { return `${H.Core.Util.clamp((Number(value) / max) * 100, 0, 100)}%`; },
    button(label, attrs = "", className = "button button-secondary") {
      return `<button class="${className}" ${attrs}>${H.Core.Util.escapeHTML(label)}</button>`;
    },
  };

  H.UI.DOM = DOM;
})(window.Haimachi);
