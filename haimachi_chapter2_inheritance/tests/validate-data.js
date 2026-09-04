#!/usr/bin/env node
"use strict";

const path = require("node:path");
const root = path.resolve(__dirname, "..");
global.window = global;
[
  "js/namespace.js",
  "js/core/utilities.js",
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
  "js/systems/season1-finale-update.js",
].forEach((file) => require(path.join(root, file)));

const D = global.Haimachi.Data;
const errors = [];
const warnings = [];
const discoveredByEffects = new Set();
const encounteredIds = new Set();
const hotspotIds = new Set();

const err = (where, message) => errors.push(`${where}: ${message}`);
const warn = (where, message) => warnings.push(`${where}: ${message}`);
const assert = (condition, where, message) => { if (!condition) err(where, message); };
const ids = (items) => new Set(items.map((item) => item.id));
const mapIds = new Set(Object.keys(D.Maps));
const npcIds = ids(D.NPCs);
const evidenceIds = ids(D.Evidence);
const deductionIds = ids(D.Deductions);
const questIds = ids(D.Quests);
const enemyIds = ids(D.Enemies);
const endingIds = ids(D.Endings);
const districtIds = new Set(D.Config.districts.map((entry) => entry.id));
const rumorIds = new Set(D.Config.initialRumors.map((entry) => entry.id));
const storyIds = new Set(Object.keys(D.StorySequences));

function unique(items, where) {
  const seen = new Set();
  for (const item of items) {
    assert(item && typeof item.id === "string" && item.id.length > 0, where, "IDがない要素があります");
    if (!item?.id) continue;
    if (seen.has(item.id)) err(where, `重複ID ${item.id}`);
    seen.add(item.id);
  }
}

function inBounds(x, y, map, margin = 0) {
  return Number.isFinite(x) && Number.isFinite(y) && x >= -margin && y >= -margin && x <= map.width + margin && y <= map.height + margin;
}

function checkCondition(condition, where) {
  if (condition == null || typeof condition === "boolean" || typeof condition === "function") return;
  if (Array.isArray(condition)) return condition.forEach((entry, index) => checkCondition(entry, `${where}[${index}]`));
  if (condition.all) checkCondition(condition.all, `${where}.all`);
  if (condition.any) checkCondition(condition.any, `${where}.any`);
  if (condition.not) checkCondition(condition.not, `${where}.not`);
  const type = condition.type;
  const id = condition.id;
  if (!type) return;
  const known = {
    evidence: evidenceIds,
    deduction: deductionIds,
    quest: questIds,
    trust: npcIds,
    npcState: npcIds,
    district: districtIds,
    rumor: rumorIds,
    mapUnlocked: mapIds,
    encounterCleared: encounteredIds,
    faction: ids(D.Config.factions || []),
  };
  if (known[type] && id && !known[type].has(id)) err(where, `condition ${type} が未知ID ${id} を参照`);
  if (type === "stat" && id && !["observation", "empathy", "authority", "resolve"].includes(id)) warn(where, `未知の能力値候補 ${id}`);
}

const allowedEffects = new Set([
  "flag", "clearFlag", "evidence", "npcTrust", "npcState", "npcMove", "world", "district", "rumor", "rumorActivate",
  "item", "currency", "stat", "xp", "heal", "questStart", "questComplete", "questFail", "questEvaluate", "mapUnlock",
  "advanceTime", "notify", "story", "combat", "openReport", "log", "encounterClear", "faction",
]);

function checkEffect(effect, where) {
  if (!effect) return;
  if (!allowedEffects.has(effect.type)) err(where, `未知のeffect type ${effect.type}`);
  const id = effect.id;
  if (effect.type === "evidence") {
    if (!evidenceIds.has(id)) err(where, `未知の証拠 ${id}`);
    else discoveredByEffects.add(id);
  }
  if (["npcTrust", "npcState", "npcMove"].includes(effect.type) && !npcIds.has(id)) err(where, `未知のNPC ${id}`);
  if (effect.type === "npcMove" && effect.mapId && !mapIds.has(effect.mapId)) err(where, `未知の移動先 ${effect.mapId}`);
  if (effect.type === "district" && !districtIds.has(id)) err(where, `未知の地区 ${id}`);
  if (["rumor", "rumorActivate"].includes(effect.type) && !rumorIds.has(id)) err(where, `未知の噂 ${id}`);
  if (effect.type === "faction" && !ids(D.Config.factions || []).has(id)) err(where, `未知の派閥 ${id}`);
  if (["questStart", "questComplete", "questFail"].includes(effect.type) && !questIds.has(id)) err(where, `未知の任務 ${id}`);
  if (effect.type === "mapUnlock" && !mapIds.has(id)) err(where, `未知の地図 ${id}`);
  if (effect.type === "story" && !storyIds.has(id)) err(where, `未知の物語シーケンス ${id}`);
  if (effect.type === "combat" && !enemyIds.has(id || effect.enemyId)) err(where, `未知の敵 ${id || effect.enemyId}`);
  if (effect.type === "encounterClear" && id && !encounteredIds.has(id)) warn(where, `encounterClear ${id} は地図上に未定義`);
}

function walkEffects(effects, where) {
  (Array.isArray(effects) ? effects : effects ? [effects] : []).forEach((effect, index) => checkEffect(effect, `${where}[${index}]`));
}

unique(D.Config.districts, "Config.districts");
unique(D.Config.initialRumors, "Config.initialRumors");
unique(D.Evidence, "Evidence");
unique(D.NPCs, "NPCs");
unique(D.MapList, "MapList");
unique(D.Deductions, "Deductions");
unique(D.Quests, "Quests");
unique(D.Enemies, "Enemies");
unique(D.Endings, "Endings");
assert(mapIds.has(D.Config.startMap), "Config.startMap", `未知の開始地図 ${D.Config.startMap}`);

for (const district of D.Config.districts) {
  district.mapIds.forEach((id) => assert(mapIds.has(id), `district ${district.id}`, `未知のmapId ${id}`));
}

for (const map of D.MapList) {
  const where = `map ${map.id}`;
  assert(districtIds.has(map.district), where, `未知の地区 ${map.district}`);
  assert(map.width > 0 && map.height > 0, where, "地図サイズが不正");
  assert(inBounds(map.spawn.x, map.spawn.y, map), where, "spawnが範囲外");
  (map.obstacles || []).forEach((rect, index) => {
    assert(rect.w > 0 && rect.h > 0, `${where}.obstacles[${index}]`, "矩形サイズが不正");
    assert(rect.x + rect.w >= 0 && rect.y + rect.h >= 0 && rect.x <= map.width && rect.y <= map.height, `${where}.obstacles[${index}]`, "矩形が地図から完全に外れている");
  });
  const localExitIds = new Set();
  for (const exit of map.exits || []) {
    if (localExitIds.has(exit.id)) err(where, `重複exit ${exit.id}`);
    localExitIds.add(exit.id);
    assert(mapIds.has(exit.targetMap), `${where}.${exit.id}`, `未知のtargetMap ${exit.targetMap}`);
    assert(inBounds(exit.x, exit.y, map, 120), `${where}.${exit.id}`, "出口座標が範囲外");
    const target = D.Maps[exit.targetMap];
    if (target) assert(inBounds(exit.targetX, exit.targetY, target, 120), `${where}.${exit.id}`, "移動先座標が範囲外");
    checkCondition(exit.condition, `${where}.${exit.id}.condition`);
  }
  for (const hotspot of map.hotspots || []) {
    if (hotspotIds.has(hotspot.id)) err(where, `重複hotspot ${hotspot.id}`);
    hotspotIds.add(hotspot.id);
    assert(inBounds(hotspot.x, hotspot.y, map, 120), `${where}.${hotspot.id}`, "hotspot座標が範囲外");
    checkCondition(hotspot.condition, `${where}.${hotspot.id}.condition`);
    const localActionIds = new Set();
    for (const action of hotspot.actions || []) {
      if (localActionIds.has(action.id)) err(`${where}.${hotspot.id}`, `重複action ${action.id}`);
      localActionIds.add(action.id);
      checkCondition(action.requires, `${where}.${hotspot.id}.${action.id}.requires`);
      walkEffects(action.effects, `${where}.${hotspot.id}.${action.id}.effects`);
    }
  }
  for (const encounter of map.encounters || []) {
    if (encounteredIds.has(encounter.id)) err(where, `重複encounter ${encounter.id}`);
    encounteredIds.add(encounter.id);
    assert(enemyIds.has(encounter.enemyId), `${where}.${encounter.id}`, `未知のenemy ${encounter.enemyId}`);
    assert(inBounds(encounter.x, encounter.y, map, 120), `${where}.${encounter.id}`, "encounter座標が範囲外");
    checkCondition(encounter.condition, `${where}.${encounter.id}.condition`);
  }
}

for (const npc of D.NPCs) {
  const map = D.Maps[npc.mapId];
  assert(Boolean(map), `npc ${npc.id}`, `未知のmapId ${npc.mapId}`);
  if (map) assert(inBounds(npc.x, npc.y, map, 120), `npc ${npc.id}`, "NPC座標が範囲外");
  assert(Boolean(D.Dialogues[npc.id]), `npc ${npc.id}`, "会話データがない");
}
for (const key of Object.keys(D.Dialogues)) assert(npcIds.has(key), `dialogue ${key}`, "対応NPCがない");

for (const [npcId, dialogue] of Object.entries(D.Dialogues)) {
  const topicSeen = new Set();
  (dialogue.greetings || []).forEach((greeting, index) => checkCondition(greeting.requires, `dialogue ${npcId}.greeting[${index}]`));
  for (const topic of dialogue.topics || []) {
    if (topicSeen.has(topic.id)) err(`dialogue ${npcId}`, `重複topic ${topic.id}`);
    topicSeen.add(topic.id);
    checkCondition(topic.requires, `dialogue ${npcId}.${topic.id}.requires`);
    checkCondition(topic.hideWhen, `dialogue ${npcId}.${topic.id}.hideWhen`);
    const optionSeen = new Set();
    for (const option of topic.options || []) {
      if (optionSeen.has(option.id)) err(`dialogue ${npcId}.${topic.id}`, `重複option ${option.id}`);
      optionSeen.add(option.id);
      checkCondition(option.requires, `dialogue ${npcId}.${topic.id}.${option.id}.requires`);
      checkCondition(option.hideWhen, `dialogue ${npcId}.${topic.id}.${option.id}.hideWhen`);
      walkEffects(option.effects, `dialogue ${npcId}.${topic.id}.${option.id}.effects`);
    }
  }
}

for (const deduction of D.Deductions) {
  const where = `deduction ${deduction.id}`;
  assert(deduction.groups.length === deduction.slots, where, `groups ${deduction.groups.length} と slots ${deduction.slots} が不一致`);
  checkCondition(deduction.availability, `${where}.availability`);
  (deduction.requiredDeductions || []).forEach((id) => assert(deductionIds.has(id), where, `未知の前提推理 ${id}`));
  deduction.groups.forEach((group, index) => {
    assert(group.length > 0, `${where}.group[${index}]`, "証拠候補が空");
    group.forEach((id) => assert(evidenceIds.has(id), `${where}.group[${index}]`, `未知の証拠 ${id}`));
  });
  walkEffects(deduction.effects, `${where}.effects`);
}

for (const quest of D.Quests) {
  const where = `quest ${quest.id}`;
  assert((quest.stages || []).length > 0, where, "stageがない");
  (quest.stages || []).forEach((stage, stageIndex) => {
    (stage.objectives || []).forEach((objective, objectiveIndex) => {
      checkCondition(objective.condition, `${where}.stage[${stageIndex}].objective[${objectiveIndex}]`);
    });
    walkEffects(stage.onCompleteEffects, `${where}.stage[${stageIndex}].effects`);
  });
}

for (const enemy of D.Enemies) {
  const where = `enemy ${enemy.id}`;
  assert(enemy.maxIntegrity > 0, where, "maxIntegrityが不正");
  assert((enemy.phases || []).length > 0, where, "phaseがない");
  assert((enemy.attacks || []).length > 0, where, "attackがない");
  assert((enemy.observeLines || []).length > 0, where, "observeLinesがない");
  walkEffects(enemy.effects, `${where}.effects`);
}

for (const [id, sequence] of Object.entries(D.StorySequences)) {
  assert(Array.isArray(sequence) && sequence.length > 0, `story ${id}`, "空の物語シーケンス");
  sequence.forEach((slide, index) => {
    assert(Boolean(slide.title), `story ${id}[${index}]`, "titleがない");
    assert(Array.isArray(slide.body) && slide.body.length > 0, `story ${id}[${index}]`, "bodyがない");
  });
}

for (const group of ["cause", "responsible", "policy"]) unique(D.Config.reportOptions[group], `reportOptions.${group}`);
const bestEnding = D.Config.bestEndingId || "ending_true_map";
assert(endingIds.has(bestEnding), "Endings", `最良結末 ${bestEnding} がない`);

for (const id of evidenceIds) {
  if (!discoveredByEffects.has(id)) warn(`evidence ${id}`, "effect経由の入手経路が見つからない");
}

console.log(`Data validation: ${errors.length} error(s), ${warnings.length} warning(s)`);
console.log(`Maps ${mapIds.size}, NPCs ${npcIds.size}, Evidence ${evidenceIds.size}, Deductions ${deductionIds.size}, Quests ${questIds.size}, Enemies ${enemyIds.size}, Endings ${endingIds.size}`);
if (warnings.length) warnings.forEach((message) => console.log(`WARN ${message}`));
if (errors.length) {
  errors.forEach((message) => console.error(`ERROR ${message}`));
  process.exit(1);
}
