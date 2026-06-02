import { useState, useEffect } from 'react'
import './style.css' // Import the new CSS file
import pronouns from '../../services/vocabulary/pronoun.json' // Import pronouns for the carousel
import connectives from '../../services/vocabulary/conectivos.json' // Import pronouns for the carousel
import categoriesIndex from '../../services/vocabulary/index.json' // Para pegar os títulos dinâmicos
import TalkTTS from '../../services/TTS' // Import TTS service
import { conjugate } from '../../services/conjugation' // Import conjugation service

export default function HomePage({ categoryName, currentPhrase, updatePhrase }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedVerb, setSelectedVerb] = useState(null)

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

  const addToPhrase = (word, type, verbTense) => {
    let finalWord = word;
    
    if (type === 'verbo' && currentPhrase) {
      const firstWord = currentPhrase.trim().split(/\s+/)[0];
      finalWord = conjugate(firstWord, word, verbTense);
    }

    updatePhrase(prev => (prev ? `${prev} ${finalWord}` : finalWord))
  }

  const handleVerbClick = (verb) => {
    setSelectedVerb(verb)
    setIsModalOpen(true)
  }

  const handleTenseSelection = (tense) => {
    if (selectedVerb) {
      addToPhrase(selectedVerb.label, 'verbo', tense)
      setIsModalOpen(false)
      setSelectedVerb(null)
    }
  }

  return (
    <div className="home-page-container">
      
      {/* Área da frase */}
      <section className="phrase-section">
        {currentPhrase || 'Sua frase sendo formada aqui'}
      </section>

      <div className="spacer-tense-selector"></div>
      
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
              onClick={() => handleVerbClick(verb)}
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

      {/* Carrossel de conectivos */}
      {connectives.length > 0 && (
        <section className="verbs-section">
          <h2 className="section-title">Conectivos</h2>
          <div className="verbs-carousel">
            {connectives.map((conn) => (
              <button
                key={conn.name}
                onClick={() => addToPhrase(conn.label, conn.type)}
                className="connective-button"
              >
                <div className="connective-box">
                  {conn.label.toUpperCase()}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
      

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

      {/* Modal de Conjugação Verbal */}
      {isModalOpen && selectedVerb && (
        <div className="verb-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="verb-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-x-button" onClick={() => setIsModalOpen(false)}>×</button>
            
            <img
              src={`/assets/vocabulary/${selectedVerb.category}/${selectedVerb.name}`}
              alt={selectedVerb.label}
              className="modal-verb-image"
            />
            <h3 className="modal-verb-label">{selectedVerb.label}</h3>
            
            <div className="modal-tense-selector">
              <button onClick={() => handleTenseSelection('past')}>Passado</button>
              <button onClick={() => handleTenseSelection('present')}>Presente</button>
              <button onClick={() => handleTenseSelection('future')}>Futuro</button>
              <button onClick={() => handleTenseSelection('imperative')}>Imperativo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}