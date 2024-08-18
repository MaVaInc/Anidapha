import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('Service Worker зарегистрирован с областью:', registration.scope);
    }).catch(error => {
      console.log('Регистрация Service Worker провалена:', error);
    });
  });
}

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
