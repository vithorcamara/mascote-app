class TalkTTS {
  constructor() {
    this.config = {
      lang: "pt-BR",
      rate: 1,
      pitch: 1,
      volume: 1,
      interrupt: true, // cancela antes de falar
    };

    this.voice = null;
    this._loadVoices();
  }

  _loadVoices() {
    const load = () => {
      const voices = window.speechSynthesis.getVoices();
      this.voice = voices.find(v => v.lang === this.config.lang);
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
  }

  configure(options = {}) {
    this.config = { ...this.config, ...options };
  }

  speak(text) {
    if (!text) return;

    if (this.config.interrupt) {
      window.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = this.config.lang;
    utterance.rate = this.config.rate;
    utterance.pitch = this.config.pitch;
    utterance.volume = this.config.volume;

    if (this.voice) {
      utterance.voice = this.voice;
    }

    window.speechSynthesis.speak(utterance);
  }

  stop() {
    window.speechSynthesis.cancel();
  }

  pause() {
    window.speechSynthesis.pause();
  }

  resume() {
    window.speechSynthesis.resume();
  }
}

export default new TalkTTS();