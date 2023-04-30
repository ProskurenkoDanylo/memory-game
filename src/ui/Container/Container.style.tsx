import styled from 'styled-components';
import { ContainerProps } from './Container';

const Container = styled.div<ContainerProps>`
  ${(props) =>
    props.flex
      ? `
    display: flex;
    justify-content: space-between;
    align-items: center;
  `
      : ''}
  max-width: 77vw;
  margin: 0 auto;

  @media (max-width: 768px) {
    max-width: 85vw;
  }
`;

export { Container };
