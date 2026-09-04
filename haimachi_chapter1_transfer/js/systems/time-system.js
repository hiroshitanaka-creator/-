(function registerTimeSystem(H) {
  "use strict";

  const { Util, SeededRNG } = H.Core;

  class TimeSystem {
    constructor(game) {
      this.game = game;
      this.weatherCycle = ["灰雨", "霧雨", "低い霧", "止み間", "煤風", "灰雨"];
    }

    advance(segments = 1, reason = "調査") {
      const state = this.game.state;
      const count = Math.max(0, Math.floor(segments));
      for (let index = 0; index < count; index += 1) {
        state.world.segment += 1;
        if (state.world.segment > 3) {
          state.world.segment = 0;
          state.world.day += 1;
          this.onNewDay();
        }
        this.onSegment(reason);
      }
      this.game.quests.evaluateAll();
      this.game.saveManager.scheduleAutoSave(state);
      this.game.bus.emit("time:changed", { day: state.world.day, segment: state.world.segment, reason });
      return { day: state.world.day, segment: state.world.segment };
    }

    onSegment(reason) {
      const state = this.game.state;
      this.game.rumors.advanceTick(reason);
      if (state.world.segment === 3) {
        state.world.weather = this.pickWeather();
      }
      if (state.world.segment === 0) {
        state.player.composure = Util.clamp(state.player.composure + 18 + state.player.stats.empathy * 2, 0, state.player.maxComposure);
      }
      this.game.world.recalculateWorldMetrics();
    }

    onNewDay() {
      const state = this.game.state;
      const difficulty = H.Data.Config.difficulty[state.settings.difficulty];
      const deadline = difficulty.deadlineDay;
      this.game.addEvent(`${Util.formatDay(state.world.day)}が始まった。街の噂網が夜の間に組み替わっている。`, "time");
      if (deadline && state.world.day > deadline && !state.world.flags.deadline_warning) {
        state.world.flags.deadline_warning = true;
        this.game.bus.emit("ui:notify", {
          title: "調査期限を超過",
          text: "ダリオ側が記録の整理を始めた。重要証拠の一部は別経路で補う必要がある。",
          icon: "刻",
          tone: "danger",
        });
        state.world.publicTrust = Util.clamp(state.world.publicTrust - 6, 0, 100);
        state.world.globalRumorPressure = Util.clamp(state.world.globalRumorPressure + 8, 0, 100);
      }
      if (state.world.day >= 5 && !state.world.flags.midgame_pressure) {
        state.world.flags.midgame_pressure = true;
        this.game.bus.emit("ui:notify", {
          title: "封鎖線が濃くなる",
          text: "北区の夜間封鎖が常態化し始めた。真相へ急ぐか、市民不安を先に抑えるか判断が必要だ。",
          icon: "鐘",
          tone: "warning",
        });
      }
    }

    pickWeather() {
      const state = this.game.state;
      const rng = new SeededRNG(state.rng?.seed || "gray-city");
      rng.restore(state.rng);
      const weighted = ["灰雨", "灰雨", "霧雨", "低い霧", "止み間", "煤風"];
      const weather = rng.pick(weighted) || "灰雨";
      state.rng = rng.snapshot();
      return weather;
    }

    getLabel() {
      const state = this.game.state;
      return `${Util.formatDay(state.world.day)}・${Util.segmentName(state.world.segment)}`;
    }
  }

  H.Systems.TimeSystem = TimeSystem;
})(window.Haimachi);
