(function registerAudioManager(H) {
  "use strict";

  class AudioManager {
    constructor(eventBus) {
      this.eventBus = eventBus;
      this.context = null;
      this.master = null;
      this.ambientGain = null;
      this.rainSource = null;
      this.droneOscillators = [];
      this.enabled = true;
      this.musicEnabled = true;
      this.volume = 0.45;
      this.lastFootstep = 0;
    }

    configure(settings) {
      this.enabled = settings.sound !== false;
      this.musicEnabled = settings.music !== false;
      this.volume = Number.isFinite(settings.volume) ? settings.volume : 0.45;
      if (this.master) this.master.gain.setTargetAtTime(this.enabled ? this.volume : 0, this.context.currentTime, 0.04);
      if (this.ambientGain) this.ambientGain.gain.setTargetAtTime(this.musicEnabled ? 0.34 : 0, this.context.currentTime, 0.08);
    }

    async unlock() {
      if (!this.context) this.createContext();
      if (this.context.state === "suspended") await this.context.resume();
      if (!this.rainSource) this.startAmbience();
    }

    createContext() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      this.context = new AudioContext();
      this.master = this.context.createGain();
      this.master.gain.value = this.enabled ? this.volume : 0;
      this.master.connect(this.context.destination);
      this.ambientGain = this.context.createGain();
      this.ambientGain.gain.value = this.musicEnabled ? 0.34 : 0;
      this.ambientGain.connect(this.master);
    }

    startAmbience() {
      if (!this.context || !this.ambientGain) return;
      const length = this.context.sampleRate * 3;
      const buffer = this.context.createBuffer(1, length, this.context.sampleRate);
      const data = buffer.getChannelData(0);
      let previous = 0;
      for (let index = 0; index < length; index += 1) {
        const white = Math.random() * 2 - 1;
        previous = previous * 0.985 + white * 0.015;
        data[index] = previous * 0.55 + white * 0.08;
      }
      const source = this.context.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      const filter = this.context.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1800;
      const gain = this.context.createGain();
      gain.gain.value = 0.32;
      source.connect(filter).connect(gain).connect(this.ambientGain);
      source.start();
      this.rainSource = source;

      const notes = [55, 82.41];
      for (const frequency of notes) {
        const oscillator = this.context.createOscillator();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        const oscillatorGain = this.context.createGain();
        oscillatorGain.gain.value = 0.018;
        oscillator.connect(oscillatorGain).connect(this.ambientGain);
        oscillator.start();
        this.droneOscillators.push({ oscillator, gain: oscillatorGain });
      }
    }

    tone(frequency = 440, duration = 0.08, type = "sine", gainValue = 0.07, delay = 0) {
      if (!this.enabled || !this.context || this.context.state !== "running") return;
      const now = this.context.currentTime + delay;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, now);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      oscillator.connect(gain).connect(this.master);
      oscillator.start(now);
      oscillator.stop(now + duration + 0.03);
    }

    ui(kind = "confirm") {
      if (kind === "confirm") {
        this.tone(510, 0.08, "triangle", 0.06);
        this.tone(680, 0.09, "triangle", 0.045, 0.045);
      } else if (kind === "cancel") {
        this.tone(290, 0.1, "triangle", 0.05);
      } else if (kind === "error") {
        this.tone(155, 0.15, "sawtooth", 0.045);
      } else if (kind === "evidence") {
        this.tone(420, 0.12, "sine", 0.05);
        this.tone(630, 0.2, "sine", 0.045, 0.08);
      } else if (kind === "deduction") {
        [262, 330, 392, 523].forEach((frequency, index) => this.tone(frequency, 0.22, "triangle", 0.04, index * 0.07));
      } else if (kind === "danger") {
        this.tone(92, 0.34, "sawtooth", 0.05);
      }
    }

    footstep(surface = "stone") {
      const now = performance.now();
      if (now - this.lastFootstep < 230) return;
      this.lastFootstep = now;
      const frequency = surface === "wood" ? 120 : surface === "water" ? 180 : 92;
      this.tone(frequency + Math.random() * 18, 0.045, "square", 0.018);
    }

    combatHit(strength = 1) {
      this.tone(110 - strength * 8, 0.11, "sawtooth", 0.04 + strength * 0.01);
      this.tone(46, 0.15, "square", 0.025);
    }

    evidence() { this.ui("evidence"); }
    deduction() { this.ui("deduction"); }
    failure() { this.ui("error"); }
    dialogue() { this.tone(360, 0.04, "triangle", 0.018); }
    setAmbience(ambient = {}) {
      if (!this.ambientGain || !this.context) return;
      const rain = Number.isFinite(ambient.rain) ? ambient.rain : 0.4;
      const target = this.musicEnabled ? 0.18 + rain * 0.24 : 0;
      this.ambientGain.gain.setTargetAtTime(target, this.context.currentTime, 0.18);
    }

    stop() {
      try { this.rainSource?.stop(); } catch (_) { /* already stopped */ }
      this.rainSource = null;
      for (const entry of this.droneOscillators) {
        try { entry.oscillator.stop(); } catch (_) { /* already stopped */ }
      }
      this.droneOscillators = [];
    }
  }

  H.Core.AudioManager = AudioManager;
})(window.Haimachi);
