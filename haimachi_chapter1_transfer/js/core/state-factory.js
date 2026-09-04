(function registerStateFactory(H) {
  "use strict";

  const { Util, SeededRNG } = H.Core;

  class StateFactory {
    static createNew(options = {}) {
      const config = H.Data.Config || {};
      const seed = options.seed ?? `${Date.now()}-${Math.random()}`;
      const rng = new SeededRNG(seed);
      const playerName = String(options.playerName || "レイ").trim().slice(0, 12) || "レイ";
      const difficulty = ["story", "investigator", "severe"].includes(options.difficulty)
        ? options.difficulty
        : "investigator";

      const npcState = {};
      for (const npc of H.Data.NPCs || []) {
        npcState[npc.id] = {
          trust: npc.initialTrust ?? 40,
          state: npc.initialState || "available",
          topicsSeen: {},
          choicesMade: {},
          memory: [],
          lastSpokenDay: null,
          discoveredSecrets: [],
          mapId: npc.mapId,
          x: npc.x,
          y: npc.y,
        };
      }

      const districtState = {};
      for (const district of config.districts || []) {
        districtState[district.id] = {
          fear: district.fear,
          security: district.security,
          trust: district.trust,
          rumorPressure: district.rumorPressure,
          visited: district.id === "central",
          condition: "open",
        };
      }

      const rumorState = {};
      for (const rumor of config.initialRumors || []) {
        rumorState[rumor.id] = {
          active: rumor.active ?? true,
          intensity: rumor.intensity,
          credibility: rumor.credibility,
          sources: rumor.sources ? rumor.sources.slice() : [],
          mutations: [],
          countered: false,
        };
      }

      const questState = {};
      for (const quest of H.Data.Quests || []) {
        questState[quest.id] = {
          status: quest.initialStatus || "locked",
          currentStage: 0,
          completedObjectives: [],
          startedAt: null,
          completedAt: null,
          failedAt: null,
          tracked: Boolean(quest.tracked),
        };
      }

      const state = {
        meta: {
          schemaVersion: H.SCHEMA_VERSION,
          gameVersion: H.VERSION,
          saveId: Util.uid("巡察"),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          playtimeSeconds: 0,
          checksum: "",
        },
        mode: "story",
        paused: true,
        player: {
          name: playerName,
          mapId: config.startMap || "map_archive",
          x: config.startPosition?.x ?? 740,
          y: config.startPosition?.y ?? 690,
          radius: 18,
          speed: 225,
          facing: "down",
          moving: false,
          composure: 100,
          maxComposure: 100,
          xp: 0,
          level: 1,
          rank: "見習い記録官",
          pendingLevelUps: 0,
          stats: {
            observation: 1,
            empathy: 1,
            authority: 1,
          },
          inventory: {
            field_notebook: 1,
            brass_lantern: 1,
            official_seal: 1,
            bandage: 2,
            calming_salt: 1,
          },
          currencies: {
            truthTokens: 0,
            patrolMarks: 0,
          },
          lastSafeMap: config.startMap || "map_archive",
          lastSafePosition: Util.deepClone(config.startPosition || { x: 740, y: 690 }),
        },
        world: {
          day: 1,
          segment: 0,
          weather: "灰雨",
          stability: 68,
          publicTrust: 48,
          globalRumorPressure: 31,
          flags: {
            intro_complete: false,
            field_kit_received: false,
            chapter_complete: false,
            postgame: false,
          },
          districts: districtState,
          rumors: rumorState,
          unlockedMaps: [config.startMap || "map_archive", "central_plaza", "north_market", "riverside"],
          usedHotspots: {},
          clearedEncounters: [],
          disabledInteractables: [],
          locationHistory: [],
          eventHistory: [],
          report: null,
          endingId: null,
        },
        npcs: npcState,
        evidence: {
          discovered: [],
          reviewed: [],
          notes: {},
          discoveryLog: [],
        },
        deductions: {
          solved: [],
          selectedClaim: null,
          selectedEvidence: [],
          attempts: {},
          log: [],
        },
        quests: questState,
        combat: null,
        dialogue: null,
        investigation: null,
        settings: {
          difficulty,
          music: true,
          sound: true,
          volume: 0.45,
          reducedMotion: window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches || false,
          highContrast: false,
          fontLarge: false,
          rainOverlay: true,
          autoSave: true,
          showHints: true,
        },
        ui: {
          activePanel: null,
          evidenceFilter: "all",
          peopleFilter: "all",
          showDebug: false,
          storyIndex: 0,
        },
        rng: rng.snapshot(),
      };

      if (state.quests.q_main) {
        state.quests.q_main.status = "active";
        state.quests.q_main.startedAt = { day: 1, segment: 0 };
      }

      StateFactory.refreshChecksum(state);
      return state;
    }

    static refreshChecksum(state) {
      const clone = Util.deepClone(state);
      if (clone.meta) clone.meta.checksum = "";
      state.meta.checksum = Util.stableHash(clone);
      state.meta.updatedAt = new Date().toISOString();
      return state.meta.checksum;
    }

    static normalizeLoaded(rawState) {
      if (!rawState || typeof rawState !== "object") throw new Error("セーブデータの形式が不正です。");
      let state = Util.deepClone(rawState);
      const schema = state.meta?.schemaVersion || 1;

      if (schema < 2) {
        state.world.unlockedMaps = state.world.unlockedMaps || ["map_archive", "central_plaza"];
        state.world.disabledInteractables = state.world.disabledInteractables || [];
        state.meta.schemaVersion = 2;
      }
      if (state.meta.schemaVersion < 3) {
        state.world.report = state.world.report || null;
        state.player.currencies = state.player.currencies || { truthTokens: 0, patrolMarks: 0 };
        state.meta.schemaVersion = 3;
      }

      const defaults = StateFactory.createNew({
        playerName: state.player?.name,
        difficulty: state.settings?.difficulty,
        seed: state.rng?.seed,
      });
      state = StateFactory.mergeDefaults(defaults, state);
      state.paused = true;
      state.mode = state.world.flags.chapter_complete ? "exploration" : state.mode;
      StateFactory.refreshChecksum(state);
      return state;
    }

    static mergeDefaults(defaults, value) {
      if (Array.isArray(defaults)) return Array.isArray(value) ? value : defaults;
      if (!defaults || typeof defaults !== "object") return value === undefined ? defaults : value;
      const result = {};
      const source = value && typeof value === "object" ? value : {};
      for (const key of new Set([...Object.keys(defaults), ...Object.keys(source)])) {
        if (Object.prototype.hasOwnProperty.call(defaults, key)) {
          result[key] = StateFactory.mergeDefaults(defaults[key], source[key]);
        } else {
          result[key] = source[key];
        }
      }
      return result;
    }
  }

  H.Core.StateFactory = StateFactory;
})(window.Haimachi);
