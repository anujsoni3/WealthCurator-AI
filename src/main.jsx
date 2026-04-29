import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initGA4 } from './lib/analytics/initGA4'

initGA4(import.meta.env.VITE_GA_MEASUREMENT_ID)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
