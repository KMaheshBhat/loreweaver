import './assets/global.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Chrome from './components/Chrome'
import { UIProvider } from './context/UIProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UIProvider>
      <Chrome />
    </UIProvider>
  </StrictMode>
)
