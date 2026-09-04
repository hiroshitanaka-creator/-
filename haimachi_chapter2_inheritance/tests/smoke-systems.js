#!/usr/bin/env node
"use strict";

const path = require("node:path");
const root = path.resolve(__dirname, "..");
global.window = global;
global.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });

[
  "js/namespace.js",
  "js/core/utilities.js",
  "js/core/rng.js",
  "js/core/event-bus.js",
  "js/core/conditions.js",
  "js/data/config.js",
  "js/data/evidence.js",
  "js/data/npcs.js",
  "js/data/maps.js",
  "js/data/dialogues.js",
  "js/data/deductions.js",
  "js/data/quests.js",
  "js/data/enemies.js",
  "js/data/story.js",
  "js/data/endings.js",
  "js/systems/chapter-transfer.js",
  "js/core/state-factory.js",
  "js/systems/world-system.js",
  "js/systems/rumor-system.js",
  "js/systems/time-system.js",
  "js/systems/ending-system.js",
  "js/systems/mcp-bridge.js",
  "js/systems/season1-finale-update.js",
].forEach((file) => require(path.join(root, file)));

const H = global.Haimachi;
const state = H.Core.StateFactory.createNew({ playerName: "検証", difficulty: "investigator", seed: "chapter2-smoke" });
const events = [];
const game = {
  state,
  bus: { emit(type, payload) { events.push({ type, payload }); } },
  addEvent(text, category) { state.world.eventHistory.push({ text, category }); },
  quests: { evaluateAll() { return true; } },
  saveManager: { scheduleAutoSave() {}, save() {} },
};
game.world = new H.Systems.WorldSystem(game);
game.rumors = new H.Systems.RumorSystem(game);
game.time = new H.Systems.TimeSystem(game);
game.endings = new H.Systems.EndingSystem(game);
game.mcp = new H.Systems.MCPBridge(game);

game.world.recalculateWorldMetrics();
game.rumors.advanceTick("smoke");
game.time.advance(1, "smoke");

state.world.flags.report_unlocked = true;
state.world.flags.final_report_unlocked = true;
state.world.flags.names_restored = true;
state.world.flags.black_ledger_stopped = true;
state.world.flags.gray_city_confronted = true;
state.world.flags.mira_rescued = true;
state.world.flags.witness_protection_ready = true;
state.world.flags.name_anchor_ready = true;
state.world.flags.black_bell_silenced = true;
state.world.stability = 60;
state.world.globalRumorPressure = 42;
state.deductions.solved = H.Data.Deductions.map((d) => d.id);
const ending = game.endings.chooseEnding({ cause: "city_record_engine", responsible: "council_core_network", policy: "rebuild_charter" });
if (ending !== H.Data.Config.bestEndingId) throw new Error(`Best ending mismatch: ${ending}`);

const rejected = game.mcp.validateProposal({ type: "state_patch", path: "world.stability", value: 0 });
if (rejected.accepted) throw new Error("MCP state patch must be rejected");
const accepted = game.mcp.submitProposal({ type: "rumor_candidate", title: "検証", text: "黒雨の候補", risk: 1 });
if (!accepted.accepted || accepted.status !== "candidate_only") throw new Error("MCP candidate should be accepted as candidate only");

console.log(`Smoke systems: pass (${events.length} event(s))`);
