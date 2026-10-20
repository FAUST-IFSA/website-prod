import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/jost'
import '@fontsource/barlow-semi-condensed/600.css'
import '@fontsource/russo-one/400.css'
import './index.css'
import App from './App.tsx'
import { LangProvider } from './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider>
      <App />
    </LangProvider>
  </StrictMode>,
)
