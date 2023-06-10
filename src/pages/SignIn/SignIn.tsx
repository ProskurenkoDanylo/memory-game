import { useState, useEffect } from 'react';

import NavBar from '../../components/layouts/NavBar';
import Input from '../../ui/Input';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';
import Container from '../../ui/Container';
import * as S from './SignIn.style';

import loginWithGoogle from '../../assets/images/Auth/google_login.png';
import Text from '../../ui/Text';

function SignIn() {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  useEffect(() => {
    setUsernameError('');
    if (username.length < 3 && username.length) {
      setUsernameError(
        (usernameError) =>
          usernameError + 'Username should consist at least 3 characters.'
      );
    }

    if (username.trim().includes(' ')) {
      setUsernameError(
        (usernameError) => usernameError + 'Username should consist any spaces.'
      );
    }
  }, [username]);

  useEffect(() => {
    setPasswordError('');
    if (password.length < 6 && password.length) {
      setPasswordError(
        (passwordError) =>
          passwordError + 'Password should consist at least 6 characters.'
      );
    }
  }, [password]);

  return (
    <>
      <NavBar />
      <main>
        <Container>
          <h2>Sign in</h2>
          <S.Form>
            <Input
              type="text"
              id="username"
              name="username"
              isRequired
              autoFocus
              isValid={!usernameError}
              errorMessage={usernameError}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              label="Username:"
            />
            <Input
              type="password"
              id="password"
              name="password"
              isRequired
              isValid={!passwordError}
              errorMessage={passwordError}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              label="Password:"
            />
            <ButtonOrLink>Login</ButtonOrLink>
          </S.Form>
          <S.HRWithText>OR</S.HRWithText>
          <a href="#" style={{ display: 'block', textAlign: 'center' }}>
            <img src={loginWithGoogle} alt="Login with Google" />
          </a>
          <Text alignment="center">Not registered yet?</Text>
          <Text alignment="center">
            <S.StyledLink to="/sign-up">Sign up here</S.StyledLink>
          </Text>
        </Container>
      </main>
    </>
  );
}
export default SignIn;
