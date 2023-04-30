import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Nav = styled.nav`
  border-bottom: 1px solid #e4e6eb;
  padding: 15px;
`;

export const NavList = styled.ul`
  display: flex;
  justify-content: space-between;
  gap: 15px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const NavLink = styled(Link)`
  transition: color 0.3s ease-in-out;
  color: #fff;
  font-size: 1.5rem;

  &:hover {
    color: #55a4e6;
  }

  &:focus {
    color: #55a4e6;
  }

  &:active {
    color: #3488ce;
  }
`;
