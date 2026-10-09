// Safe Web Audio API sound generator for tactical telemetry cues & downland wind ambiance

class TacticalAudio {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientNoiseSource: AudioBufferSourceNode | null = null;
  public isAmbientPlaying: boolean = false;
  public isMuted: boolean = false;
  private muteListeners: Array<(muted: boolean) => void> = [];

  constructor() {
    try {
      this.isMuted = localStorage.getItem('raptorlens_audio_muted') === 'true';
    } catch {
      this.isMuted = false;
    }
  }

  public subscribeMute(listener: (muted: boolean) => void) {
    this.muteListeners.push(listener);
    return () => {
      this.muteListeners = this.muteListeners.filter((l) => l !== listener);
    };
  }

  private notifyMute() {
    try {
      localStorage.setItem('raptorlens_audio_muted', this.isMuted ? 'true' : 'false');
    } catch {}
    this.muteListeners.forEach((l) => l(this.isMuted));
  }

  public setMuted(muted: boolean): boolean {
    this.isMuted = muted;
    if (this.isMuted && this.isAmbientPlaying) {
      this.stopDownlandBreeze();
    }
    this.notifyMute();
    return this.isMuted;
  }

  public toggleMuted(): boolean {
    return this.setMuted(!this.isMuted);
  }

  private stopDownlandBreeze() {
    try {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
        setTimeout(() => {
          this.ambientNoiseSource?.stop();
          this.ambientNoiseSource?.disconnect();
          this.ambientNoiseSource = null;
          this.isAmbientPlaying = false;
        }, 350);
      } else {
        this.isAmbientPlaying = false;
      }
    } catch {
      this.isAmbientPlaying = false;
    }
  }

  private initCtx() {
    if (this.isMuted) return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Tactical radar ping / chirp
  public playRadarPing(frequency: number = 880) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(frequency * 1.5, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.18);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  // Tactical target lock / confirmed log beep
  public playConfirmChime() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'triangle';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(587.33, this.ctx.currentTime); // D5
      osc1.frequency.setValueAtTime(880.00, this.ctx.currentTime + 0.08); // A5

      osc2.frequency.setValueAtTime(1174.66, this.ctx.currentTime + 0.08); // D6

      gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start();
      osc2.start(this.ctx.currentTime + 0.08);
      osc1.stop(this.ctx.currentTime + 0.35);
      osc2.stop(this.ctx.currentTime + 0.35);
    } catch {
      // Ignore
    }
  }

  // Downland breeze wind simulator (gentle pink/brownian noise with resonant filter)
  public toggleDownlandBreeze(): boolean {
    try {
      this.initCtx();
      if (!this.ctx) return false;

      if (this.isAmbientPlaying) {
        if (this.ambientGain) {
          this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
          setTimeout(() => {
            this.ambientNoiseSource?.stop();
            this.ambientNoiseSource?.disconnect();
            this.ambientNoiseSource = null;
            this.isAmbientPlaying = false;
          }, 850);
        }
        return false;
      } else {
        // Generate 4 seconds of looping low-pass filtered noise
        const bufferSize = this.ctx.sampleRate * 4;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        let lastOut = 0.0;
        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          data[i] = (lastOut + (0.02 * white)) / 1.02;
          lastOut = data[i];
          data[i] *= 3.5; // boost brownian wind
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        noise.loop = true;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, this.ctx.currentTime);
        filter.Q.setValueAtTime(2.0, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.045, this.ctx.currentTime + 1.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
        this.ambientNoiseSource = noise;
        this.ambientGain = gain;
        this.isAmbientPlaying = true;
        return true;
      }
    } catch {
      return false;
    }
  }

  // Realistic synthesized bird-of-prey flight calls (Web Audio API)
  public playSpeciesCall(speciesId: string) {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      switch (speciesId) {
        case 'buzzard': {
          // Common Buzzard: Characteristic prolonged, cat-like descending mew ("pee-yooow")
          const osc = this.ctx.createOscillator();
          const vibrato = this.ctx.createOscillator();
          const vibratoGain = this.ctx.createGain();
          const gain = this.ctx.createGain();

          osc.type = 'triangle';
          vibrato.frequency.setValueAtTime(6, t);
          vibratoGain.gain.setValueAtTime(35, t);

          vibrato.connect(osc.frequency);
          osc.frequency.setValueAtTime(2450, t);
          osc.frequency.exponentialRampToValueAtTime(1450, t + 1.1);

          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.12, t + 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 1.25);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          vibrato.start(t);
          osc.start(t);
          vibrato.stop(t + 1.25);
          osc.stop(t + 1.25);
          break;
        }

        case 'red-kite': {
          // Red Kite: High musical piping whistle with trailing staccato trill ("wheee-oo, chee-chee")
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();

          osc.type = 'sine';
          // Initial high swoop
          osc.frequency.setValueAtTime(2200, t);
          osc.frequency.exponentialRampToValueAtTime(2850, t + 0.3);
          osc.frequency.exponentialRampToValueAtTime(2000, t + 0.6);

          gain.gain.setValueAtTime(0.01, t);
          gain.gain.linearRampToValueAtTime(0.11, t + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.02, t + 0.6);

          // Staccato chitters
          for (let i = 0; i < 3; i++) {
            const pulseT = t + 0.65 + i * 0.12;
            osc.frequency.setValueAtTime(2700, pulseT);
            osc.frequency.exponentialRampToValueAtTime(2200, pulseT + 0.08);
            gain.gain.setValueAtTime(0.1, pulseT);
            gain.gain.exponentialRampToValueAtTime(0.005, pulseT + 0.09);
          }

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(t);
          osc.stop(t + 1.15);
          break;
        }

        case 'kestrel': {
          // Common Kestrel: Piercing, rapid, staccato alarm / hover call ("kik-kik-kik-kik")
          const count = 5;
          for (let i = 0; i < count; i++) {
            const pt = t + i * 0.11;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(3100, pt);
            osc.frequency.exponentialRampToValueAtTime(2400, pt + 0.06);

            gain.gain.setValueAtTime(0.1, pt);
            gain.gain.exponentialRampToValueAtTime(0.001, pt + 0.07);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(pt);
            osc.stop(pt + 0.075);
          }
          break;
        }

        case 'peregrine': {
          // Peregrine Falcon: Harsh, abrasive barking chatter ("kak-kak-kak-kak")
          const count = 6;
          for (let i = 0; i < count; i++) {
            const pt = t + i * 0.12;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1750, pt);
            osc.frequency.exponentialRampToValueAtTime(1250, pt + 0.07);

            gain.gain.setValueAtTime(0.09, pt);
            gain.gain.exponentialRampToValueAtTime(0.001, pt + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(pt);
            osc.stop(pt + 0.085);
          }
          break;
        }

        case 'sparrowhawk': {
          // Eurasian Sparrowhawk: Rapid excited, high shrill chatter ("kew-kew-kew")
          const count = 6;
          for (let i = 0; i < count; i++) {
            const pt = t + i * 0.09;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(2800, pt);
            osc.frequency.exponentialRampToValueAtTime(2100, pt + 0.05);

            gain.gain.setValueAtTime(0.08, pt);
            gain.gain.exponentialRampToValueAtTime(0.001, pt + 0.06);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(pt);
            osc.stop(pt + 0.065);
          }
          break;
        }

        case 'hen-harrier':
        case 'marsh-harrier': {
          // Harrier: High nasal chatter ("ke-ke-ke")
          const count = 5;
          for (let i = 0; i < count; i++) {
            const pt = t + i * 0.13;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(2200, pt);
            osc.frequency.exponentialRampToValueAtTime(1800, pt + 0.08);

            gain.gain.setValueAtTime(0.09, pt);
            gain.gain.exponentialRampToValueAtTime(0.001, pt + 0.09);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(pt);
            osc.stop(pt + 0.095);
          }
          break;
        }

        case 'hobby': {
          // Eurasian Hobby: Clear, rapid, flute-like falcon falconets ("kew-kew-kew-kew")
          const count = 5;
          for (let i = 0; i < count; i++) {
            const pt = t + i * 0.08;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(3200, pt);
            osc.frequency.exponentialRampToValueAtTime(2600, pt + 0.05);

            gain.gain.setValueAtTime(0.09, pt);
            gain.gain.exponentialRampToValueAtTime(0.001, pt + 0.055);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(pt);
            osc.stop(pt + 0.06);
          }
          break;
        }

        case 'osprey': {
          // Osprey: High clear musical whistling chirps ("kyeep-kyeep-kyeep")
          const count = 4;
          for (let i = 0; i < count; i++) {
            const pt = t + i * 0.16;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(1800, pt);
            osc.frequency.exponentialRampToValueAtTime(2600, pt + 0.06);
            osc.frequency.exponentialRampToValueAtTime(1900, pt + 0.11);

            gain.gain.setValueAtTime(0.1, pt);
            gain.gain.exponentialRampToValueAtTime(0.001, pt + 0.12);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(pt);
            osc.stop(pt + 0.13);
          }
          break;
        }

        case 'barn-owl': {
          // Barn Owl: Eerie raspy wheezing shriek (filtered noise)
          const bufferSize = this.ctx.sampleRate * 0.8;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noise = this.ctx.createBufferSource();
          noise.buffer = buffer;

          const filter = this.ctx.createBiquadFilter();
          filter.type = 'bandpass';
          filter.frequency.setValueAtTime(2200, t);
          filter.frequency.exponentialRampToValueAtTime(1600, t + 0.7);
          filter.Q.setValueAtTime(4.0, t);

          const gain = this.ctx.createGain();
          gain.gain.setValueAtTime(0.001, t);
          gain.gain.linearRampToValueAtTime(0.14, t + 0.1);
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.75);

          noise.connect(filter);
          filter.connect(gain);
          gain.connect(this.ctx.destination);

          noise.start(t);
          noise.stop(t + 0.8);
          break;
        }

        default: {
          // General raptor whistle chirp
          this.playRadarPing(1100);
          break;
        }
      }
    } catch {
      // Audio context may require user activation
    }
  }
}

export const tacticalAudio = new TacticalAudio();
