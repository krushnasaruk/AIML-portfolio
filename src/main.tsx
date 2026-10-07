import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/anton';
import '@fontsource/archivo-black';
import '@fontsource/big-shoulders-display';
import '@fontsource/big-shoulders-display/900';
import '@fontsource/big-shoulders-display/800';
import '@fontsource/cormorant-garamond';
import '@fontsource/instrument-serif';
import '@fontsource/inter-tight';
import '@fontsource/jetbrains-mono';
import '@fontsource/libre-baskerville';
import '@fontsource/manrope';
import '@fontsource/michroma';
import '@fontsource/oswald';
import '@fontsource/space-grotesk';
import '@fontsource/syncopate';
import '@fontsource/syne';
import '@fontsource/unbounded';
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
