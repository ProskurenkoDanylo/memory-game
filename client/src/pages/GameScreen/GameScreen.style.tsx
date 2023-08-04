import styled, { keyframes } from 'styled-components';

export const GameBoard = styled.div`
  width: 100%;
  margin: 20px auto 50px auto;
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  gap: 20px;

  @media (min-width: 500px) {
    width: 75%;
  }

  @media (min-width: 700px) {
    width: 70%;
  }

  @media (min-width: 826px) {
    width: 50%;
  }

  @media (min-width: 1140px) {
    width: 40%;
  }
`;

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
