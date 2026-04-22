import React from 'react';
import ReactDOM from 'react-dom/client';
import { I18nextProvider } from 'react-i18next';
import { MuiProvider } from './app/providers/MuiProvider';
import App from './App';
import i18n from './shared/i18n';

import './app/styles/globals.css';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <MuiProvider>
        <App />
      </MuiProvider>
    </I18nextProvider>
  </React.StrictMode>
);