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

export const SocialLogin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const LoginWithGoogle = styled.button`
  .sign-icon {
    background-color: #fff;
    padding: 8px;
    border-radius: 0.1em;

    img {
      display: block;
      width: 18px;
      height: auto;
    }
  }

  display: flex;
  gap: 8px;
  align-items: center;
  background-color: #4285f4;
  color: #fff;
  font-size: 14px;
  padding: 2px 8px 2px 2px;
  border: none;
  border-radius: 0.2em;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: 250ms background-color ease-in-out;

  &:hover {
    background-color: #2677fa;
  }
`;

export const LoginWithFacebook = styled.button`
  .sign-icon {
    img {
      display: block;
      width: 18px;
      height: auto;
    }
  }

  display: flex;
  gap: 8px;
  align-items: center;
  background-color: #1a77f2;
  color: #fff;
  font-size: 14px;
  padding: 10px 5px;
  border: none;
  border-radius: 0.2em;
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: 250ms background-color ease-in-out;

  &:hover {
    background-color: #2677fa;
  }
`;
