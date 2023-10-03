import styled, { keyframes, css } from 'styled-components';
import bombIcon from '../../assets/images/bomb.png';
import explosion from '../../assets/images/explosion.png';

interface GameBoardProps {
  size: null | number;
}

export const GameBoard = styled.div<GameBoardProps>`
  width: 100%;
  margin: 20px auto 50px auto;
  display: grid;
  justify-items: center;
  grid-template-columns: repeat(${({ size }) => size}, 1fr);
  grid-template-rows: repeat(${({ size }) => size}, 1fr);
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
  height: 60%;
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

export const Suggestion = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 25%;
  font-size: 1.75em;
  font-weight: bold;
`;

export const Shadow = styled.div`
  width: 100%;
  height: 100%;
  background-color: transparent;
  transition: box-shadow ease 0.5s;
`;

const agreeDisagreeCommon = css`
  height: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${Shadow} {
    position: absolute;
    z-index: 998;
  }
`;

const agreeDisagreeButtonsCommon = css`
  text-align: center;
  color: #fff;
  border: none;
  border-radius: 0.25em;
  padding: 10px 15px;
  min-width: 100px;
`;

export const Agree = styled.div`
  ${agreeDisagreeCommon}
`;

export const AgreeButton = styled.button`
  ${agreeDisagreeButtonsCommon}
  background-color: #10a922;
  align-self: flex-end;
  margin-bottom: 50px;

  &:hover ~ ${Shadow} {
    box-shadow: inset 0px -20px 15px -10px rgba(16, 169, 34, 0.8);
  }
`;

export const Disagree = styled.div`
  ${agreeDisagreeCommon}
`;

export const DisagreeButton = styled.button`
  ${agreeDisagreeButtonsCommon}
  background-color: #e43314;
  align-self: flex-start;
  margin-top: 50px;

  &:hover ~ ${Shadow} {
    box-shadow: inset 0px 20px 15px -10px rgba(228, 51, 20, 0.8);
  }
`;
