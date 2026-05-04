import { useState, useEffect } from 'react'
import './style.css' // Import the new CSS file
import pronouns from '../../services/vocabulary/pronoun.json' // Import pronouns for the carousel
import categoriesIndex from '../../services/vocabulary/index.json' // Para pegar os títulos dinâmicos
import TalkTTS from '../../services/TTS' // Import TTS service
import { conjugate } from '../../services/conjugation' // Import conjugation service

export default function HomePage({ categoryName, currentPhrase, updatePhrase, tense = 'present', setTense }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  // Encontrar o label amigável da categoria (Ex: "comida" -> "Comida")
  const categoryLabel = categoriesIndex.find(cat => cat.name === categoryName)?.label || 'Objetos'

  // Import dinâmico do JSON da categoria
  useEffect(() => {
    if (!categoryName) return; // ⚠️ evita import undefined

    setLoading(true)
    setItems([])
    window.scrollTo(0, 0) // Garante que a página comece no topo

    import(`../../services/vocabulary/${categoryName}.json`)
      .then(module => {
        setItems(module.default)
        console.log('Vocabulário carregado:', module.default)
      })
      .catch(err => {
        console.error('Erro ao carregar vocabulário:', err)
        setItems([])
      })
      .finally(() => setLoading(false))
  }, [categoryName])

  useEffect(() => {
    TalkTTS.configure({
      lang: "pt-BR",
      rate: 1,
      pitch: 1,
    });
  }, []);

  // Separação de objetos e verbos
  const objects = items
  .filter(item => item.type === 'objeto')
  .sort((a, b) =>
    a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' })
  );
  
  const verbs = items
  .filter(item => item.type === 'verbo')
  .sort((a, b) =>
    a.label.localeCompare(b.label, 'pt-BR', { sensitivity: 'base' })
  )

  const addToPhrase = (word, type) => {
    let finalWord = word;
    
    if (type === 'verbo' && currentPhrase) {
      const firstWord = currentPhrase.trim().split(/\s+/)[0];
      finalWord = conjugate(firstWord, word, tense);
    }

    updatePhrase(prev => (prev ? `${prev} ${finalWord}` : finalWord))
  }

  return (
    <div className="home-page-container">
      
      {/* Área da frase */}
      <section className="phrase-section">
        {currentPhrase || 'Sua frase sendo formada aqui'}
      </section>

      {/* Seleção de Tempo Verbal */}
      <div className="tense-selector">
        <button 
          className={`tense-button ${tense === 'past' ? 'active' : ''}`}
          onClick={() => setTense('past')}
        >
          Passado
        </button>
        <button 
          className={`tense-button ${tense === 'present' ? 'active' : ''}`}
          onClick={() => setTense('present')}
        >
          Presente
        </button>
        <button 
          className={`tense-button ${tense === 'future' ? 'active' : ''}`}
          onClick={() => setTense('future')}
        >
          Futuro
        </button>
        <button 
          className={`tense-button ${tense === 'imperative' ? 'active' : ''}`}
          onClick={() => setTense('imperative')}
        >
          Imperativo
        </button>
      </div>
      
      {/* Carrossel de pronomes */}
      <section className="verbs-section">
        <h2 className="section-title">Pronomes</h2>
        <div className="verbs-carousel">
          {pronouns.map((pronoun) => (
            <button
              key={pronoun.name}
              onClick={() => addToPhrase(pronoun.label, pronoun.type)}
              className="pronoun-button"
            >
              <div className="pronoun-image-container">
                <img
                  src={`/assets/vocabulary/pronomes/${pronoun.name}.png`}
                  alt={pronoun.label}
                  className="pronoun-image"
                  loading="lazy"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.classList.add('no-image');
                  }}
                />
                <span className="pronoun-initial">{pronoun.label[0]}</span>
              </div>
              <span className="pronoun-label">{pronoun.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Carrossel de verbos */}
      <section className="verbs-section">
        <h2 className="section-title">Verbos</h2>
        <div className="verbs-carousel">
          {verbs.map((verb) => (
            <button
              key={verb.name}
              onClick={() => addToPhrase(verb.label, verb.type)}
              className="verb-button"
            >
              <img
                src={`/assets/vocabulary/${verb.category}/${verb.name}`}
                alt={verb.label}
                className="verb-image"
                loading="lazy"
                onError={(e) => e.target.style.display = 'none'} // Esconde imagem se falhar
              />
              <span>{verb.label}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Grid de objetos */}
      <section className="objects-grid-container">
        <h2 className="section-title">{categoryLabel}</h2>
        <div className="objects-grid-section">
          {loading ? (
            <p>Carregando...</p>
          ) : (
            objects.map(item => (
              <div
                key={item.name}
                onClick={() => addToPhrase(item.label, item.type)}
                className="object-card"
              >
                <img
                  src={`/assets/vocabulary/${item.category}/${item.name}`}
                  alt={item.label}
                  className="object-image"
                  loading="lazy"
                />
                <div className="object-label">{item.label}</div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}