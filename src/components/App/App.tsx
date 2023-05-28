import { useState } from 'react';

import Container from '../../ui/Container';
import NavBar from '../layouts/NavBar';
import { useUser } from '../../hooks/useUser';
import ButtonOrLink from '../../ui/ButtonOrLink';
import Input from '../../ui/Input';

import { IoSettings } from 'react-icons/io5';
import Card from '../Card';
import fireBorder from '../../assets/images/fire-border.svg';
import defaultCover from '../../assets/images/default-cover.svg';

function App() {
  const { login, logout } = useUser();
  const [inputValue, setInputValue] = useState<string>('');
  const [cardOpened, setCardOpened] = useState(false);

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
              <ButtonOrLink
                $colors={['#ff456f', '#687ff3']}
                $startIcon={<IoSettings />}
                $endIcon={<IoSettings />}>
                Button
              </ButtonOrLink>
            </p>
            <p>
              <ButtonOrLink
                link="/"
                $startIcon={<IoSettings />}
                $endIcon={<IoSettings />}>
                Link
              </ButtonOrLink>
            </p>
          </li>
          <li>
            <p>Input component done</p>
            <Input
              id="input"
              name="input"
              value={inputValue}
              label="Username:"
              placeholder="Enter your name"
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              type="email"
              id="input2"
              name="input2"
              value={inputValue}
              label="Username:"
              isValid={false}
              placeholder="Enter your name"
              errorMessage="Some error"
              startIcon={<IoSettings />}
              endIcon={
                <img src="https://www.cdc.gov/ncbddd/autism/addm-community-report/images/children-playing-index.png?_=99639" />
              }
              onChange={(e) => setInputValue(e.target.value)}
            />
            <Input
              id="input3"
              name="input3"
              value={inputValue}
              label="Username:"
              placeholder="Enter your name"
              disabled
              onChange={(e) => setInputValue(e.target.value)}
            />
          </li>
          <li>
            <Card
              frontIconURL={defaultCover}
              back="https://picsum.photos/200/300"
              border={{
                borderWidth: 20,
                borderColor: 'white',
                borderStyle: 'solid',
                borderImageURL: fireBorder,
              }}
              opened={cardOpened}
              onClick={() => setCardOpened((opened) => !opened)}
            />
          </li>
        </ul>
      </Container>
    </>
  );
}

export default App;
