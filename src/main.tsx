import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { useStore } from './store/useStore';

// Load initial data
const loadInitialData = async () => {
  const store = useStore.getState();
  try {
    await Promise.all([
      store.fetchUnits(),
      store.fetchLaborRates(),
      store.fetchMileageRates(),
      store.fetchProjects()
    ]);
  } catch (error) {
    console.error('Failed to load initial data:', error);
  }
};

// Load data when the app starts
loadInitialData();

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);