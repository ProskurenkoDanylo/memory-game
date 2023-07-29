import { createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import DifficultyChoosing from '../pages/DifficultyChoosing';
import ModeChoosing from '../pages/ModeChoosing';
import CategoryChoosing from '../pages/CategoryChoosing';
import GameScreen from '../pages/GameScreen';

export const routes = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/sign-in',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
  {
    path: '/game',
    element: <GameScreen />,
  },
  {
    path: '/game/difficulty',
    element: <DifficultyChoosing />,
  },
  {
    path: '/game/mode',
    element: <ModeChoosing />,
  },
  {
    path: '/game/category',
    element: <CategoryChoosing />,
  },
]);
