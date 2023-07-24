import styled from 'styled-components';

export const Categories = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: center;
  gap: 20px 4%;
`;

export const Category = styled.button`
  display: block;
  width: 22%;
  aspect-ratio: 3 / 4;
  padding: 0;
  border: 2px solid #e4e5ef;
  border-radius: 0.25em;
  background-color: #0e162b;
  transition: all 0.3s ease-in-out;
  cursor: pointer;

  &:hover {
    background-color: #11395c;
    border-color: #6597e0;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const Centered = styled.div`
  text-align: center;
  margin-bottom: 50px;
`;
