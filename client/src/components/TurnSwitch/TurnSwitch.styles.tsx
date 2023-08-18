import styled from 'styled-components';
import { BsChevronRight, BsChevronLeft } from 'react-icons/bs';

export const MyTurn = styled(BsChevronLeft)`
  align-self: flex-end;
  margin-block-end: 15px;
`;

export const OpponentTurn = styled(BsChevronRight)`
  align-self: flex-end;
  margin-block-end: 15px;
`;
