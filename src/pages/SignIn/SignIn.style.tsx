import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const Form = styled.form`
  label {
    margin-top: 2em;
  }

  button {
    display: block;
    margin: 2em auto;
  }
`;

export const HRWithText = styled.p`
  overflow: hidden;
  text-align: center;

  &:before,
  &:after {
    background-color: #fff;
    content: '';
    display: inline-block;
    height: 1px;
    position: relative;
    vertical-align: middle;
    width: 50%;
  }

  &:before {
    right: 0.5em;
    margin-left: -50%;
  }

  &:after {
    left: 0.5em;
    margin-right: -50%;
  }
`;

export const StyledLink = styled(Link)`
  color: #55a4e6;
`;
