import styled, { css } from 'styled-components';

interface CardWrapperProps {
  opened: boolean;
  disabled: boolean;
}

interface CardProps {
  borderWidth: string | number;
  borderStyle: string;
  borderColor: string;
  borderImageURL?: string;
}

export const Card = styled.div<CardProps>`
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  border: ${({ borderWidth, borderStyle, borderColor }: CardProps) =>
    `${borderWidth}px ${borderStyle} ${borderColor}`};
  border-radius: 0.75em;
  transition: transform 0.4s;
  transform-style: preserve-3d;
  ${({ borderImageURL }: CardProps) => {
    if (!borderImageURL) {
      return ``;
    }
    if (borderImageURL) {
      return `border-image-source: url(${borderImageURL});
      border-image-slice: 32;
      border-image-repeat: round;
      div, img {
        border-radius: 0!important;
      }
      `;
    }
  }};
`;

export const CardWrapper = styled.div`
  background-color: transparent;
  width: 100%;
  aspect-ratio: 3 / 4;
  perspective: 1000px;
  cursor: pointer;

  ${({ disabled }: CardWrapperProps) =>
    disabled
      ? css`
          pointer-events: none;
          opacity: 0.5;
        `
      : ''}

  ${({ opened }: CardWrapperProps) =>
    opened
      ? css`
          ${Card} {
            transform: rotateY(180deg);
          }
        `
      : ''}
`;

const sharedBetweenFrontAndBack = css`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border-radius: 0.75em;
  background-color: #0e162b;
  overflow: hidden;
`;

export const CardFront = styled.div`
  display: grid;
  place-items: center;
  color: #fff;
  ${sharedBetweenFrontAndBack}

  img {
    width: 25%;
    object-fit: contain;
    user-select: none;
  }
`;

export const CardBack = styled.div`
  color: #fff;
  transform: rotateY(180deg);

  img {
    width: 100%;
    height: 100%;
  }

  ${sharedBetweenFrontAndBack}
`;
