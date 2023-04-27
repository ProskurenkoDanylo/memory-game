import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import GlobalStyle from './globalStyles.ts';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <GlobalStyle />
    <App />
  </React.StrictMode>
);
