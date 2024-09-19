import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { DependenciesProvider } from './infrastructure/dependencies-provider.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <DependenciesProvider>
      <App />
    </DependenciesProvider>
  </React.StrictMode>,
);
