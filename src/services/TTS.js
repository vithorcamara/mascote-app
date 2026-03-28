class TalkTTS {
  constructor() {
    this.config = {
      lang: "pt-BR",
      rate: 1,
      pitch: 1,
      volume: 1,
      interrupt: true,
    };

    this.voice = null;
    this.voices = [];

    this._loadVoices();
  }

  _loadVoices() {
    const load = () => {
      this.voices = window.speechSynthesis.getVoices();
      this.voice =
        this.voices.find(v => v.lang === this.config.lang) ||
        this.voices[0];
    };

    load();
    window.speechSynthesis.onvoiceschanged = load;
  }

  getVoices() {
    return this.voices;
  }

  setVoiceByName(name) {
    const voice = this.voices.find(v => v.name === name);
    if (voice) this.voice = voice;
  }

  configure(options = {}) {
    this.config = { ...this.config, ...options };

    // salvar automaticamente
    localStorage.setItem("tts-config", JSON.stringify(this.config));
  }

  loadSavedConfig() {
    const saved = localStorage.getItem("tts-config");
    if (saved) {
      this.config = { ...this.config, ...JSON.parse(saved) };
    }
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
}

export default new TalkTTS();