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

  // 🔄 atualização normal
  const updateServiceWorker = () => {
    if (workbox) {
      workbox.addEventListener('controlling', () => {
        window.location.reload()
      })
      workbox.messageSkipWaiting()
    }
  }

  // 🧹🔥 FORMATAÇÃO TOTAL + UPDATE
  const hardReset = async () => {
    try {
      // remove todos os caches
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))

      // remove todos os service workers
      const registrations = await navigator.serviceWorker.getRegistrations()
      for (let reg of registrations) {
        await reg.unregister()
      }

      // força reload (vai baixar tudo novo)
      window.location.reload(true)
    } catch (err) {
      console.error('Erro ao resetar app:', err)
    }
  }

  if (!offlineReady && !needRefresh) return null

  return (
    <div className="update-toast">
      <div className="update-content">

        <div className="update-text">
          {offlineReady
            ? "App pronto para uso offline"
            : "Nova versão disponível"}
        </div>

        <div className="update-actions">
          {needRefresh && (
            <button className="btn-update" onClick={updateServiceWorker}>
              Atualizar
            </button>
          )}

          <button className="btn-reset" onClick={hardReset}>
            Formatar App
          </button>

          <button className="btn-close" onClick={close}>
            ✕
          </button>
        </div>

      </div>
    </div>
  )
}

export default ReloadPrompt