import Container from '../../ui/Container';
import NavBar from '../layouts/NavBar';
import { useUser } from '../../hooks/useUser';
import { UserProvider } from '../../context/UserContext';

function App() {
  const { login, logout } = useUser();

  const testUser = {
    id: 1,
    name: 'Test user',
    email: 'test@email.com',
  };

  return (
    <>
      <UserProvider>
        <NavBar />
        <Container>
          <h1>Project status</h1>
          <ul>
            <li>Initial template done</li>
            <li>
              <p>NavBar component done</p>
              <button onClick={() => login(testUser)}>Sign in test user</button>
              <button onClick={() => logout()}>Sign out test user</button>
            </li>
          </ul>
        </Container>
      </UserProvider>
    </>
  );
}

export default App;
