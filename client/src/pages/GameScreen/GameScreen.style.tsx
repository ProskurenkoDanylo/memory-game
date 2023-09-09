import styled, { keyframes, css } from 'styled-components';
import bombIcon from '../../assets/images/bomb.png';
import explosion from '../../assets/images/explosion.png';

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

const fallAndExplode = keyframes`
  0% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0);
    top: -100%;
  }
  
  20% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(1);
    top: 40%;
  }

  30% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0.3);
    top: 40%;
  }

  35% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0.25) rotate(25deg);
    top: 40%;
  }

  40% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0.20) rotate(-25deg);
    top: 40%;
  }

  45% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0.15) rotate(25deg);
    top: 40%;
  }

  50% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0.1) rotate(-25deg);
    top: 40%;
  }

  55% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0.05) rotate(25deg);
    top: 40%;
  }

  60% {
    background-image: url(${bombIcon});
    transform: translateX(-50%) scale(0);
    top: 40%;
  }

  61% {
    background-image: url(${explosion});
    transform: translateX(-50%) scale(0.6);
    top: 40%;
  }

  65% {
    background-image: url(${explosion});
    transform: translateX(-50%) scale(0.95);
    top: 40%;
  }
  
  100% {
    transform: translateX(-50%) scale(1);
    top: 40%;
    background-image: url(${explosion});
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

export const WaitingForPlayer = styled.p`
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
  font-weight: bold;
  text-wrap: balance;
  padding: 0 10px;
`;

export const Bomb = styled.div<{ animate: boolean }>`
  position: absolute;
  z-index: 25;
  left: 50%;
  top: -100%;
  transform: translateX(-50%) scale(0);
  width: 50%;
  height: 50%;
  background-image: url(${bombIcon});
  background-size: contain;
  background-repeat: no-repeat;

  ${({ animate }) =>
    animate &&
    css`
      animation: ${fallAndExplode} 5s linear;
      animation-fill-mode: forwards;
    `}
`;
