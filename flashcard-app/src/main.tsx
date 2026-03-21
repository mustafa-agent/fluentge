import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

// Global auth check: if no user logged in, clear all user data
// Cloud sync restores everything when user logs back in
if (!localStorage.getItem('fluentge-user')) {
  // Keep only 'theme' setting, clear everything else user-related
  const keepKeys = new Set(['theme']);
  const keysToRemove: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && !keepKeys.has(key)) {
      keysToRemove.push(key);
    }
  }
  keysToRemove.forEach(k => localStorage.removeItem(k));
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
