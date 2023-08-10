import styled, { keyframes, css } from 'styled-components';

const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

export const Score = styled.span`
  position: relative;
`;

export const ComboScore = styled.span`
  position: absolute;
  right: -107px;
  width: 100px;
  text-align: left;
  color: #c69a00;
  opacity: 1;

  animation: ${fadeOut} 3s linear;
  animation-fill-mode: forwards;
`;

export const ProfileImg = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  align-self: flex-end;
`;

export const PlayerBoard = styled.div`
  border-bottom: 2px solid;
`;

type FlexProps = {
  align: 'left' | 'right';
  playerTurn: boolean;
};

export const Flex = styled.div<FlexProps>`
  p {
    margin-block-end: 10px;
  }
  display: flex;
  gap: 25px;
  align-items: center;

  ${({ align }) =>
    align === 'left'
      ? css`
          flex-direction: row;
        `
      : css`
          flex-direction: row-reverse;
        `}

  ${({ playerTurn }) =>
    playerTurn
      ? css`
          opacity: 1;
        `
      : css`
          opacity: 0.6;
        `}

  ${ProfileImg} {
    ${({ align }) =>
      align === 'left'
        ? css`
            border: 1px solid #1f57ff;
          `
        : css`
            border: 1px solid #ff3131;
          `}
  }

  ${PlayerBoard} {
    p {
      margin: 5px 0;
    }
    ${({ align }) =>
      align === 'left'
        ? css`
            border-color: #1f57ff;
          `
        : css`
            border-color: #ff3131;
          `}
  }
`;

export const Achievement = styled.img`
  width: 25px;
  height: 25px;
`;
