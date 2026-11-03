import { createRoot } from 'react-dom/client'
import '@fontsource/cormorant-garamond/500.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/mukta/400.css'
import '@fontsource/mukta/500.css'
import '@fontsource/noto-serif-devanagari/500.css'
import '@fontsource/gowun-batang/400.css'
import '@fontsource/gowun-batang/700.css'
import '@fontsource/yatra-one/400.css'
import './styles.css'
import { App } from './App'
import { startStats } from './lib/stats'

startStats()
createRoot(document.getElementById('root')!).render(<App />)
