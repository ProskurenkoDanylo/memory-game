import styled, { css } from 'styled-components';

export const Modal = styled.div<{ visible: boolean }>`
  ${({ visible }) =>
    visible === false &&
    css`
      display: none;
    `}
  position: fixed;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 30;
  text-align: center;
  * {
    position: relative;
    z-index: 999;
  }
`;
