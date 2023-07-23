import styled from 'styled-components';

export const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  gap: 4%;

  // TODO fix vertical gaps
`;

export const Category = styled.button`
  display: block;
  width: 22%;
  aspect-ratio: 3 / 4;
  border: 2px solid #e4e5ef;
  border-radius: 0.25em;
  background-color: #0e162b;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #0e162b;
    border-color: #fff;
  }

  img {
    width: 100%;
    height: auto;
  }
`;

export const Centered = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;
