import styled from 'styled-components';
import TextProps from './Text.type';

export const Text = styled.p<TextProps>`
  text-align: ${({ alignment }) => alignment};
  color: ${({ color }) => color};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-size: clamp(1rem, 0.95rem + 0.25vw, 1.25rem);
`;
