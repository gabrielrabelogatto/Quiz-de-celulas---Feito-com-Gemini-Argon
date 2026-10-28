/**
 * ==========================================================================
 * MÓDULO DE ÁUDIO AMIGÁVEL (Web Audio API)
 * Gera uma musiquinha alegre estilo caixinha de música / jogo educativo
 * e efeitos sonoros divertidos sem precisar de arquivos MP3 externos!
 * ==========================================================================
 */

class SoundManager {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isPlayingBGM = false;
    this.bgmInterval = null;
    this.stepIndex = 0;

    // Melodia amigável e acolhedora em Dó Maior / Pentatônica (frequências em Hz)
    this.melodyNotes = [
      { freq: 523.25, dur: 0.28 }, // C5
      { freq: 659.25, dur: 0.28 }, // E5
      { freq: 783.99, dur: 0.28 }, // G5
      { freq: 659.25, dur: 0.28 }, // E5
      { freq: 880.00, dur: 0.42 }, // A5
      { freq: 783.99, dur: 0.42 }, // G5
      { freq: 659.25, dur: 0.28 }, // E5
      { freq: 587.33, dur: 0.28 }, // D5
      { freq: 523.25, dur: 0.28 }, // C5
      { freq: 587.33, dur: 0.28 }, // D5
      { freq: 659.25, dur: 0.42 }, // E5
      { freq: 523.25, dur: 0.45 }, // C5
      { freq: 392.00, dur: 0.30 }, // G4
      { freq: 440.00, dur: 0.30 }, // A4
      { freq: 523.25, dur: 0.50 }, // C5
      { freq: 0,      dur: 0.30 }  // Pausa suave
    ];
  }

  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  startMusic() {
    this.initContext();
    if (!this.ctx || this.isPlayingBGM) return;

    this.isPlayingBGM = true;
    this.updateUIButton();

    this.bgmInterval = setInterval(() => {
      if (this.isMuted || !this.ctx) return;

      const note = this.melodyNotes[this.stepIndex % this.melodyNotes.length];
      this.stepIndex++;

      if (note.freq > 0) {
        this.playSoftTone(note.freq, note.dur, 0.055, 'sine');
        // Harmonia suave uma oitava abaixo a cada 4 notas
        if (this.stepIndex % 4 === 1) {
          this.playSoftTone(note.freq * 0.5, note.dur * 1.4, 0.03, 'triangle');
        }
      }
    }, 380);
  }

  stopMusic() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.isPlayingBGM = false;
    this.updateUIButton();
  }

  toggleMute() {
    this.initContext();
    if (!this.isPlayingBGM) {
      this.isMuted = false;
      this.startMusic();
      this.playClick();
      return;
    }
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.playClick();
    }
    this.updateUIButton();
  }

  updateUIButton() {
    const labelEl = document.getElementById('audio-status-label');
    const iconEl = document.getElementById('audio-status-icon');
    if (!labelEl || !iconEl) return;

    if (this.isPlayingBGM && !this.isMuted) {
      iconEl.textContent = '🎵';
      labelEl.textContent = 'Música: Ligada';
    } else {
      iconEl.textContent = '🔇';
      labelEl.textContent = 'Música: Silenciada';
    }
  }

  playSoftTone(freq, duration, maxGain = 0.08, waveType = 'sine') {
    if (this.isMuted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = waveType;
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(maxGain, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {
      // Ignora erros de autoplay antes de interação
    }
  }

  playClick() {
    this.initContext();
    this.playSoftTone(660, 0.1, 0.09, 'sine');
  }

  playPop() {
    this.initContext();
    this.playSoftTone(520, 0.08, 0.1, 'triangle');
    setTimeout(() => this.playSoftTone(780, 0.12, 0.09, 'sine'), 50);
  }

  playPortalZoom() {
    this.initContext();
    if (this.isMuted || !this.ctx) return;
    const notes = [392.00, 523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playSoftTone(freq, 0.22, 0.09, 'sine'), idx * 80);
    });
  }

  playSuccess() {
    this.initContext();
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, idx) => {
      setTimeout(() => this.playSoftTone(f, 0.25, 0.11, 'triangle'), idx * 90);
    });
  }

  playGentleHint() {
    this.initContext();
    this.playSoftTone(349.23, 0.2, 0.08, 'sine');
    setTimeout(() => this.playSoftTone(329.63, 0.28, 0.08, 'sine'), 140);
  }

  playFanfare() {
    this.initContext();
    const fanfare = [523.25, 659.25, 783.99, 1046.50, 783.99, 1046.50];
    const delays = [0, 130, 260, 390, 580, 740];
    fanfare.forEach((f, i) => {
      setTimeout(() => this.playSoftTone(f, 0.35, 0.12, 'triangle'), delays[i]);
    });
  }
}

window.soundManager = new SoundManager();
