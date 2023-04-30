import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';

import GlobalStyle from './globalStyles.ts';

import { UserProvider } from './context/UserContext';
import { routes } from './data/routes.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={routes} />
      <GlobalStyle />
    </UserProvider>
  </React.StrictMode>
);
