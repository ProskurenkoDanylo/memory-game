import styled, { keyframes } from 'styled-components';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

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

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 50px;
`;

export const MyTurn = styled(BsChevronLeft)`
  align-self: flex-end;
  margin-block-end: 15px;
`;

export const OpponentTurn = styled(BsChevronRight)`
  align-self: flex-end;
  margin-block-end: 15px;
`;

export const WaitingForPlayer = styled.p`
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
  font-weight: bold;
  text-wrap: balance;
  padding: 0 10px;
`;

export const Timer = styled.span`
  font-size: 1.3rem;
  color: #fff;
  font-weight: bold;
  text-align: center;
`;
