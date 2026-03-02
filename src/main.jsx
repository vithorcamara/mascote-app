import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Workbox } from 'workbox-window'
import App from './pages/App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

if ('serviceWorker' in navigator) {
  const wb = new Workbox('/sw.js', { scope: '/' })

  wb.addEventListener('waiting', () => {
    window.dispatchEvent(new CustomEvent('sw-update', { detail: wb }))
  })

  wb.addEventListener('activated', (event) => {
    // `event.isUpdate` will be true if another version of the service
    // worker was already active during registration.
    if (!event.isUpdate) {
      // If there is no active service worker, it means this is the first activation.
      // We want to show the "ready to work offline" message.
      window.dispatchEvent(new Event('sw-offline-ready'))
    }
  })

  wb.register()
}
