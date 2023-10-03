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

export const Powers = styled.div`
  height: 1em;
  & > * {
    margin-right: 5px;
  }
`;

export const PlayerBoard = styled.div`
  border-bottom: 2px solid;
`;

type FlexProps = {
  align: 'left' | 'right';
  playerTurn: boolean;
  playerHere: boolean;
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
    ${({ playerHere, align }) =>
      playerHere
        ? align === 'left'
          ? css`
              border: 1px solid #1f57ff;
            `
          : css`
              border: 1px solid #ff3131;
            `
        : css`
            border: 1px solid #9000ff;
          `}
  }

  ${PlayerBoard} {
    margin: 5px 0;
    p {
      margin: 5px 0;
    }
    ${({ playerHere, align }) =>
      playerHere
        ? align === 'left'
          ? css`
              border-bottom: 2px solid #1f57ff;
            `
          : css`
              border-bottom: 2px solid #ff3131;
            `
        : css`
            border-bottom: 2px solid #9000ff;
          `}
  }
`;

export const Achievement = styled.img`
  width: 25px;
  height: 25px;
`;

export const Timer = styled.p`
  font-size: 1.3rem;
  color: #fff;
  font-weight: bold;
  text-align: left;
`;

export const BombIcon = styled.img`
  width: 25px;
  height: 25px;
  vertical-align: middle;
  z-index: 5;
`;

export const ReveilCardsButton = styled.button<{ used: boolean }>`
  ${({ used }) =>
    used &&
    css`
      opacity: 0.6;
    `}
  cursor: pointer;
  display: block;
  border-radius: 25%;
  border: 1px solid #fff;
  background-color: #0e162b;
  padding: 0.5em;
`;
