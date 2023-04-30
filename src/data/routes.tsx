import { createBrowserRouter } from 'react-router-dom';
import App from '../components/App';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
  },
]);
