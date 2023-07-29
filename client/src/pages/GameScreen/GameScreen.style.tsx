import styled from 'styled-components';

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
