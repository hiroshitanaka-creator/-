(function bootstrapNamespace(global) {
  "use strict";
  const previous = global.Haimachi || {};
  global.Haimachi = Object.assign(previous, {
    VERSION: "1.1.0-chapter2-inheritance",
    SCHEMA_VERSION: 5,
    BUILD_DATE: "2026-09-04",
    Core: previous.Core || {},
    Data: previous.Data || {},
    Systems: previous.Systems || {},
    Render: previous.Render || {},
    UI: previous.UI || {},
    Runtime: previous.Runtime || {},
  });
})(window);
