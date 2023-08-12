import styled, { css } from 'styled-components';

export const Modal = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 50% 0;
  z-index: 999;
  text-align: center;
  & > * {
    margin: 10px auto;
  }
`;

const sharedText = css`
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
