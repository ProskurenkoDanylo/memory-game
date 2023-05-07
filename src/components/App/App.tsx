import Container from '../../ui/Container';
import NavBar from '../layouts/NavBar';
import { useUser } from '../../hooks/useUser';
import ButtonOrLink from '../../ui/Container/ButtonOrLink';

function App() {
  const { login, logout } = useUser();

  const testUser = {
    id: 1,
    name: 'Test user',
    email: 'test@email.com',
  };

  return (
    <>
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
          <li>
            <p>Button component done</p>
            <p>
              <ButtonOrLink $colors={['#ff456f', '#687ff3']}>
                Button
              </ButtonOrLink>
            </p>
            <p>
              <ButtonOrLink link="/">Button</ButtonOrLink>
            </p>
          </li>
        </ul>
      </Container>
    </>
  );
}

export default App;
