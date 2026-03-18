import { useState, useMemo, useEffect } from 'react'
import HomePage from './HomePage'
import AboutPage from './AboutPage'
import SettingsPage from './SettingsPage' // Import SettingsPage
import ReloadPrompt from '../components/ReloadPrompt'
import './App.css'
import categoriesIndex from '../services/vocabulary/index.json'
import TalkTTS from '../services/TTS'
import { CiMicrophoneOn, CiTrash, CiStreamOn } from "react-icons/ci";

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('') // estado global da categoria. Use empty string for no category selected.
  const [currentPage, setCurrentPage] = useState('home') // 'home', 'about', 'settings', 'exit'
  const [currentPhrase, setCurrentPhrase] = useState('') // estado global da frase
  const [selectedTense, setSelectedTense] = useState('present') // 'present', 'past', 'future'
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const [isFabOpen, setIsFabOpen] = useState(false)
  const hasMultipleWords = useMemo(() => {
    return currentPhrase.trim().split(/\s+/).filter(Boolean).length >= 2
  }, [currentPhrase])

  useEffect(() => {
    if (currentPhrase.trim().split(/\s+/).filter(Boolean).length >= 2) {
      setIsFabOpen(true)
    } else{
      setIsFabOpen(false)
    }
  }, [currentPhrase])
  
  return (
    <div className={`app-container ${isMenuOpen ? 'menu-open' : ''}`}>
      <ReloadPrompt />

      {/* Menu lateral */}
      <aside id="side-menu" className={`side-menu ${isMenuOpen ? 'menu-open' : ''}`}>
        <nav>
          <ul>
            {/* Categorias do vocabulário */}
            {categoriesIndex.map((cat) => (
              <li key={cat.name}>
                <button
                  onClick={() => {
                    setSelectedCategory(cat.name)
                    setCurrentPage('home') // Selecting a category now displays on HomePage
                    setIsMenuOpen(false)
                  }}
                  className={selectedCategory === cat.name && currentPage === 'home' ? 'menu-item-active' : ''}
                >
                  {cat.label}
                </button>
              </li>
            ))}
            <br />
            <hr width="80%" size="1" color="white" align="left"/>   
            <br />
            {/* Outras páginas */}
            <li key="about">
              <button
                onClick={() => { setSelectedCategory(''); setCurrentPage('about'); toggleMenu() }}
                className={currentPage === 'about' ? 'menu-item-active' : ''}
              >
                Sobre
              </button>
            </li>
            <li key="settings">
              <button
                onClick={() => { setSelectedCategory(''); setCurrentPage('settings'); toggleMenu() }}
                className={currentPage === 'settings' ? 'menu-item-active' : ''}
              >
                Configurações
              </button>
            </li>
            <li key="exit">
              <button
                onClick={() => { setSelectedCategory(''); setCurrentPage('exit'); toggleMenu() }}
                className={currentPage === 'exit' ? 'menu-item-active' : ''}
              >
                Sair
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Ícone superior direito do usuário */}
      <div className="user-icon-container">
        MG
      </div>

      {/* Conteúdo principal */}
      <main className="main-content">
        {currentPage === 'about' && <AboutPage currentPhrase={currentPhrase} updatePhrase={setCurrentPhrase} />}
        {currentPage === 'settings' && <SettingsPage currentPhrase={currentPhrase} updatePhrase={setCurrentPhrase} />}
        {currentPage === 'exit' && <div>Saindo...</div>}
        {(currentPage === 'home' || currentPage === 'category') && ( // Render HomePage for home and category selection
          <HomePage 
            categoryName={selectedCategory || 'vestuario'} 
            currentPhrase={currentPhrase} 
            updatePhrase={setCurrentPhrase} 
            tense={selectedTense}
            setTense={setSelectedTense}
          />
        )}
      </main>

      {/* Floating Action Button */}
      <div className="fab-wrapper">

        {/* Botões secundários */}
        <button
          className={`fab-action fab-action-1 ${isFabOpen ? 'open' : ''}`}
          onClick={() => {
            TalkTTS.speak(currentPhrase)
          }}
          aria-hidden={!isFabOpen}
        >
          <CiStreamOn className='react-icon' />
        </button>

        <button
          className={`fab-action fab-action-2 ${isFabOpen ? 'open' : ''}`}
          onClick={() => {
            setCurrentPhrase('')
          }}
          aria-hidden={!isFabOpen}
        >
          <CiTrash className='react-icon' />
        </button>

        <button
          className={`fab-action fab-action-3 ${isFabOpen ? 'open' : ''}`}
          onClick={() => {
            setCurrentPage('settings')
          }}
          aria-hidden={!isFabOpen}
        >
          <CiMicrophoneOn className='react-icon' />
        </button>

        {/* Botão principal */}
        <button
          className={`fab-main ${isFabOpen ? 'rotate' : ''} ${hasMultipleWords ? 'active' : ''}`}
          onClick={toggleMenu}
          aria-expanded={isFabOpen}
        >
          <img src="/favicon.svg" alt="Ações" />
        </button>

      </div>
    </div>
  )
}