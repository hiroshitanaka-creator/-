(function bootstrapNamespace(global) {
  "use strict";
  const previous = global.Haimachi || {};
  global.Haimachi = Object.assign(previous, {
    VERSION: "0.9.2-chapter1-transfer",
    SCHEMA_VERSION: 3,
    BUILD_DATE: "2026-09-04",
    Core: previous.Core || {},
    Data: previous.Data || {},
    Systems: previous.Systems || {},
    Render: previous.Render || {},
    UI: previous.UI || {},
    Runtime: previous.Runtime || {},
  });
})(window);
