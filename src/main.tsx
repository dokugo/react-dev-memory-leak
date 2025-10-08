import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { TanstackTable } from './TanstackTable.tsx'
// import { PlainTable } from './PlainTable.tsx'

import './index.css'

declare global {
  interface Window {
    hideIntro: boolean
  }
}

function initReactScan() {
  setTimeout(async () => {
    const { scan } = await import('react-scan')

    window.hideIntro = true

    scan({
      enabled: process.env.NODE_ENV === 'development',
      trackUnnecessaryRenders: true,
      animationSpeed: 'slow',
    })
  }, 1000)
}

initReactScan()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TanstackTable />
    {/* <PlainTable /> */}
  </StrictMode>
)
