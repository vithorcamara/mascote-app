import { useEffect, useState } from "react";
import TalkTTS from "../../services/TTS";

export default function TTSModal({ isOpen, onClose }) {
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [volume, setVolume] = useState(1);
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    // carrega config salva
    TalkTTS.loadSavedConfig();

    setRate(TalkTTS.config.rate);
    setPitch(TalkTTS.config.pitch);
    setVolume(TalkTTS.config.volume);

    const loadVoices = () => {
      const v = TalkTTS.getVoices();
      setVoices(v);

      if (TalkTTS.voice) {
        setSelectedVoice(TalkTTS.voice.name);
      }
    };

    loadVoices();

    // fallback (alguns navegadores carregam vozes depois)
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [isOpen]);

  const handleTest = () => {
    TalkTTS.speak("Olá, essa é a voz selecionada");
  };

  if (!isOpen) return null;

  return (
    <div className="tts-overlay" onClick={onClose}>
      <div className="tts-modal" onClick={(e) => e.stopPropagation()}>

        <h2>Configurar Voz</h2>

        {/* VOZ */}
        <label>
          Voz
          <select
            value={selectedVoice}
            onChange={(e) => {
              setSelectedVoice(e.target.value);
              TalkTTS.setVoiceByName(e.target.value);
            }}
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </label>

        {/* VELOCIDADE */}
        <label>
          Velocidade: {rate}
          <input
            type="range"
            min="0.5"
            max="2"
            step="0.1"
            value={rate}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setRate(value);
              TalkTTS.configure({ rate: value });
            }}
          />
        </label>

        {/* TOM */}
        <label>
          Tom: {pitch}
          <input
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={pitch}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setPitch(value);
              TalkTTS.configure({ pitch: value });
            }}
          />
        </label>

        {/* VOLUME */}
        <label>
          Volume: {volume}
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              setVolume(value);
              TalkTTS.configure({ volume: value });
            }}
          />
        </label>

        {/* BOTÕES */}
        <div className="tts-actions">
          <button onClick={handleTest}>🔊 Testar</button>
          <button onClick={onClose}>Fechar</button>
        </div>

      </div>
    </div>
  );
}