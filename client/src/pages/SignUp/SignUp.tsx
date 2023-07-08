import { useState, useEffect, useContext, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

// components related
import { ClipLoader } from 'react-spinners';
import NavBar from '../../components/layouts/NavBar';
import Input from '../../ui/Input';
import ButtonOrLink from '../../ui/ButtonOrLink/ButtonOrLink';
import Container from '../../ui/Container';
import Text from '../../ui/Text';
import * as S from '../SignIn/SignIn.style';

// assets
import googleLogo from '../../assets/images/Auth/google-logo.svg';
import facebookLogo from '../../assets/images/Auth/facebook-logo.svg';

// api
import { addUser, loginUserByCredentials } from '../../api';

function SignUp() {
  let navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [secondPassword, setSecondPassword] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [loading, setLoading] = useState(false);

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
    if (secondPassword && secondPassword !== password) {
      setPasswordError(
        (passwordError) => passwordError + 'Passwords do not match.'
      );
    }
    if (password.length < 6 && password.length) {
      setPasswordError(
        (passwordError) =>
          passwordError + 'Password should consist at least 6 characters.'
      );
    }
  }, [password, secondPassword]);

  const googleLogin = () => {
    window.open('https://localhost:3000/auth/google');
  };

  const facebookLogin = () => {
    window.open('https://localhost:3000/auth/facebook');
  };

  const registerUser = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await addUser({
      username: username,
      password,
      profileImg:
        'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg',
    })
      .then((res) => res.json())
      .then(async (data) => {
        setLoading(false);
        if (!data.error) {
          await loginUserByCredentials(username, password).then((res) => {
            const url = new URL(res.url);
            login();
            setLoading(false);
            navigate(url.pathname);
            window.location.reload();
          });
        } else {
          if (data.error.toLowerCase().includes('user')) {
            setUsernameError(data.error);
          } else {
            setPasswordError(data.error);
          }
        }
      });
  };

  return (
    <>
      <NavBar />
      <main>
        <Container>
          <h2>Sign up</h2>
          <S.Form method="post" onSubmit={registerUser}>
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
            <Input
              type="password"
              id="password"
              name="password"
              isRequired
              isValid={!passwordError}
              value={secondPassword}
              onChange={(e) => setSecondPassword(e.target.value)}
              label="Password:"
            />{' '}
            {loading ? (
              <ClipLoader
                color="#00ffea"
                size={60}
                cssOverride={{
                  display: 'block',
                  margin: '10px auto',
                }}
              />
            ) : (
              <ButtonOrLink
                disabled={usernameError !== '' || passwordError !== ''}>
                Register
              </ButtonOrLink>
            )}
          </S.Form>
          <S.HRWithText>OR</S.HRWithText>
          <S.SocialLogin>
            <S.LoginWithGoogle onClick={googleLogin}>
              <div className="sign-icon">
                <img src={googleLogo} alt="Login with Google" />
              </div>
              Sign in with Google
            </S.LoginWithGoogle>
            <S.LoginWithFacebook onClick={facebookLogin}>
              <div className="sign-icon">
                <img src={facebookLogo} alt="Login with Facebook" />
              </div>
              Sign in with Facebook
            </S.LoginWithFacebook>
          </S.SocialLogin>
          <Text alignment="center">Already registered?</Text>
          <Text alignment="center">
            <S.StyledLink to="/sign-in">Login here</S.StyledLink>
          </Text>
        </Container>
      </main>
    </>
  );
}
export default SignUp;
