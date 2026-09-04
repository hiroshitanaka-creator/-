#!/usr/bin/env node
"use strict";
const path = require("node:path");
const root = path.resolve(__dirname, "..");
global.window = global;
global.window.matchMedia = () => ({ matches: false, addEventListener() {}, removeEventListener() {} });
class MemoryStorage { constructor(){ this.map = new Map(); } getItem(k){ return this.map.has(k) ? this.map.get(k) : null; } setItem(k,v){ this.map.set(k,String(v)); } removeItem(k){ this.map.delete(k); } }
global.localStorage = new MemoryStorage();
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
].forEach((file) => require(path.join(root, file)));
const H = global.Haimachi;
const fakeGame = { bus: { emit() {} } };
const transfer = new H.Systems.ChapterTransfer(fakeGame);
const chapter1Save = {
  meta: { gameVersion: "0.9.2-chapter1-transfer", playtimeSeconds: 1234 },
  player: { name: "検証官", rank: "巡察記録官", level: 3, stats: { observation: 3, empathy: 2, authority: 2 }, currencies: {} },
  world: { day: 8, segment: 2, stability: 64, publicTrust: 71, globalRumorPressure: 32, endingId: "ending_true_map", report: { cause: "compound", responsible: "shared", policy: "staged", note: "検証" }, flags: { chapter_complete: true, eld_rescued: true, witness_protection_ready: true, rain_bell_repaired: true, ines_confessed: true, dario_command_proven: true, report_unlocked: true }, eventHistory: [], districts: { north: { fear: 32 } } },
  npcs: { naira: { trust: 80 }, eld: { trust: 75 }, ines: { trust: 72 } },
  evidence: { discovered: ["e_a", "e_b"] },
  deductions: { solved: ["d_watch_detained_eld", "d_eld_in_waterworks", "d_dario_ordered_coverup", "d_gray_salt_mechanism", "d_complete_case"] },
};
const payload = transfer.persist(chapter1Save);
if (!payload.chapter || payload.chapter.profile !== "true_map") throw new Error("profile not derived");
const state = H.Core.StateFactory.createNew({ playerName: "仮", difficulty: "investigator", seed: "transfer-test" });
transfer.applyToState(state, payload);
if (!state.world.flags.inherited_chapter1) throw new Error("inheritance flag missing");
if (!state.world.flags.ch1_truth_anchor) throw new Error("truth anchor missing");
if (state.player.name !== "検証官") throw new Error("player name not inherited");
if ((state.npcs.naira.trust || 0) <= H.Data.NPCById.naira.initialTrust) throw new Error("naira trust not raised");
if ((state.world.rumors.r_eld_lied.intensity || 0) >= 51) throw new Error("eld rumor was not weakened");
if (!state.world.unlockedMaps.includes("audit_hall")) throw new Error("audit hall should be unlocked by true map profile");
console.log("Transfer smoke: pass");
