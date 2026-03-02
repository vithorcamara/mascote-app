import { useState, useEffect } from 'react'
import './style.css'

function ReloadPrompt() {
  const [offlineReady, setOfflineReady] = useState(false)
  const [needRefresh, setNeedRefresh] = useState(false)
  const [workbox, setWorkbox] = useState(null)

  useEffect(() => {
    const handleUpdate = (event) => {
      setNeedRefresh(true)
      setWorkbox(event.detail)
    }

    const handleOfflineReady = () => {
      setOfflineReady(true)
    }

    window.addEventListener('sw-update', handleUpdate)
    window.addEventListener('sw-offline-ready', handleOfflineReady)

    return () => {
      window.removeEventListener('sw-update', handleUpdate)
      window.removeEventListener('sw-offline-ready', handleOfflineReady)
    }
  }, [])

  const close = () => {
    setOfflineReady(false)
    setNeedRefresh(false)
  }

  const updateServiceWorker = () => {
    if (workbox) {
      workbox.addEventListener('controlling', () => {
        window.location.reload()
      })
      workbox.messageSkipWaiting()
    }
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="reload-prompt">
      <div className="reload-prompt-message">
        {offlineReady ? (
          <span>O App está pronto para uso offline!</span>
        ) : (
          <span>Nova versão disponível. Clique em atualizar para carregar.</span>
        )}
      </div>
      <div className="reload-prompt-buttons">
        {needRefresh && (
          <button className="reload-prompt-update" onClick={updateServiceWorker}>
            Atualizar
          </button>
        )}
        <button className="reload-prompt-close" onClick={close}>
          Fechar
        </button>
      </div>
    </div>
  )
}

export default ReloadPrompt
