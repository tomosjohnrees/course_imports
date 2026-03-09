import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './global.css'
import './tokens.css'
import { applyThemeToDOM } from './lib/theme'
import App from './App'

// Apply persisted theme before first render to prevent flash
const initialTheme = window.api?.initialTheme ?? 'system'
applyThemeToDOM(initialTheme)

const root = document.getElementById('root')
if (root) {
  createRoot(root).render(
    <StrictMode>
      <App />
    </StrictMode>
  )
}
