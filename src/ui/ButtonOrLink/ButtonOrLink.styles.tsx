import styled, { css } from 'styled-components';
import { Link as RouterLink } from 'react-router-dom';
import { ButtonOrLink } from './ButtonOrLink.type';
import tinycolor from 'tinycolor2';

function createGradient(colors: string[], colorsDirection?: number) {
  return `linear-gradient(${colorsDirection}deg, ${colors.map(
    (color, index) =>
      ` ${color} ${index * (100 / colors.length)}%, ${color} ${
        (index + 1) * (100 / colors.length)
      }%`
  )})`;
}

function makeDarker(
  colors: string | string[],
  colorsDirection?: number,
  darkerAmount: number = 10
) {
  if (!Array.isArray(colors)) {
    return tinycolor(colors).darken(darkerAmount).toString();
  } else {
    const newColors = colors.map((color) =>
      tinycolor(color).darken(darkerAmount).toString()
    );
    return createGradient(newColors, colorsDirection);
  }
}

const sharedStyles = css`
  color: ${({ $textColor }: ButtonOrLink) => $textColor};
  background: ${({ $colors, $colorsDirection }: ButtonOrLink) =>
    !Array.isArray($colors)
      ? $colors
      : createGradient($colors, $colorsDirection)};
  transition: ${({ $transitionTimeInMs }: ButtonOrLink) =>
      $transitionTimeInMs}ms
    all ease-in-out;
  cursor: pointer;
  border: none;
  border-radius: 0.5em;
  padding: 15px 30px;
  min-width: 150px;
  outline-color: #fff;

  &:hover {
    background: ${({ $colors, $colorsDirection }: ButtonOrLink) =>
      makeDarker($colors ? $colors : '#0D66B1', $colorsDirection, 4)};
  }

  &:active {
    background: ${({ $colors, $colorsDirection }: ButtonOrLink) =>
      makeDarker($colors ? $colors : '#0D66B1', $colorsDirection, 7)};
  }
`;

export const Button = styled.button`
  ${sharedStyles};

  &:disabled {
    opacity: 0.9;
    pointer-events: none;
  }
`;

export const Link = styled(RouterLink)`
  display: inline-block;
  text-align: center;
  text-decoration: none;
  ${sharedStyles};
`;
