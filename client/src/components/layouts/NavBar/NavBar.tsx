import { useContext } from 'react';
import { AuthContext } from '../../../context/AuthContext';

// icons
import { FaHome, FaTrophy, FaUserCircle, FaSignInAlt } from 'react-icons/fa';
import { IoSettings } from 'react-icons/io5';

import * as S from './NavBar.styles';
import Container from '../../../ui/Container';

const NavBar = () => {
  const { isAuthenticated } = useContext(AuthContext);

  return (
    <S.Nav>
      <Container flex>
        <div className="home">
          <S.NavLink to="/" aria-label="Home">
            <FaHome />
          </S.NavLink>
        </div>
        {isAuthenticated ? (
          <S.NavList>
            <li>
              <S.NavLink to="" aria-label="Settings">
                <IoSettings />
              </S.NavLink>
            </li>
            <li>
              <S.NavLink to="" aria-label="Leaderboard">
                <FaTrophy />
              </S.NavLink>
            </li>
            <li>
              <S.NavLink to="" aria-label="Account">
                <FaUserCircle />
              </S.NavLink>
            </li>
          </S.NavList>
        ) : (
          <div>
            <S.NavLink to="/sign-in" aria-label="Sign in">
              <FaSignInAlt />
            </S.NavLink>
          </div>
        )}
      </Container>
    </S.Nav>
  );
};

export default NavBar;
