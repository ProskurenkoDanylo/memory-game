import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import GlobalStyle from './globalStyles.ts';

import { AuthProvider } from './context/AuthContext.tsx';
import { routes } from './data/routes.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={routes} />
      <GlobalStyle />
    </AuthProvider>
  </React.StrictMode>
);
