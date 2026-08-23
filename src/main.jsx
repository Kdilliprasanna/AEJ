import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import OfflineCareerApp from './OfflineCareerApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OfflineCareerApp />
  </StrictMode>,
)
