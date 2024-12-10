import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useStore } from './store/useStore';

function Root() {
  const initialize = useStore(state => state.initialize);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <StrictMode>
      <App />
    </StrictMode>
  );
}

createRoot(document.getElementById('root')!).render(<Root />);