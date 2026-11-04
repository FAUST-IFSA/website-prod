// Entry for /privacy/ (privacy/index.html). A second static page, not a route: GitHub Pages has no SPA fallback.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/jost'
import '@fontsource/barlow-semi-condensed/600.css'
import '@fontsource/russo-one/400.css'
import './index.css'
import { LangProvider } from './i18n'
import { Privacy } from './pages/Privacy'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider title={(copy) => copy.privacy.meta.title}>
      <Privacy />
    </LangProvider>
  </StrictMode>,
)
