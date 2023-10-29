import styled, { css, keyframes } from 'styled-components';

const scaleAndUnscale = keyframes`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.5);
  }

  100% {
    transform: scale(1);
  }
`;

const sharedText = css`
  animation: ${scaleAndUnscale} 700ms ease-in-out;
  animation-iteration-count: 2;
  font-size: 2em;
  font-weight: bold;
`;

export const WinText = styled.p`
  ${sharedText}
  color: #ffcc00;
`;

export const LooseText = styled.p`
  ${sharedText}
  color: #ff2f00;
`;

export const DrawText = styled.p`
  ${sharedText}
  color: #067b8f;
`;

export const Centered = styled.div`
  display: grid;
  align-content: center;
  justify-content: center;
  height: 100%;
  & > * {
    margin: 10px auto;
  }
`;

export const Buttons = styled.div`
  & > :first-child {
    margin-inline-end: 10px;
  }
`;
