import styled from 'styled-components';

export const OpenHistoryButton = styled.button`
  border: none;
  background: transparent;
  text-align: center;
  color: #d9d9d9;
  cursor: pointer;
`;

export const HistoryTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #d9d9d9;
`;

export const History = styled.div`
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;

  .win p,
  .lose p,
  .draw p {
    font-weight: bold;
  }

  .win p {
    color: #0fb01f;
  }

  .lose p {
    color: #b0180f;
  }

  .draw p {
    color: #c69a00;
  }
`;
