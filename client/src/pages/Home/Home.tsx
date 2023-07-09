import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

import { ClipLoader } from 'react-spinners';
import NavBar from '../../components/layouts/NavBar';

import Landing from './Landing';

function Home() {
  const { isAuthenticated, user, contextLoading } = useContext(AuthContext);

  return (
    <>
      <NavBar />
      {contextLoading && false ? (
        <ClipLoader
          color="#00ffea"
          size={60}
          cssOverride={{
            display: 'block',
            margin: '10px auto',
          }}
        />
      ) : !isAuthenticated && false ? (
        <Landing />
      ) : (
        <p>Hello, {(user as any)?.username}</p>
      )}
    </>
  );
}

export default Home;
