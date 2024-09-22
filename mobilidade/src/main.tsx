import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AppContext } from './services/context/context';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <AppContext>
      <App />
    </AppContext>
  </React.StrictMode>
);