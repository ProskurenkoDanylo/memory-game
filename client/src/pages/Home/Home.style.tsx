import styled from 'styled-components';

import { FaTrophy } from 'react-icons/fa';

export const LandingPreviewImg = styled.img`
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 2.5em auto;
`;

export const CompaniesBoard = styled.div`
  background-color: #16234f;
  margin-top: 1em;

  & > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
  }
`;

export const ModesBoard = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 2.5em 0;
`;

export const DifficultyLevels = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  margin: 2.5em 0;

  div {
    border-radius: 0.75rem;
    padding: 15px 30px;
  }

  div:first-child {
    background-color: #0fb01f;
  }
  div:nth-child(2) {
    background-color: #c69a00;
  }
  div:last-child {
    background-color: #b0180f;
  }
`;

export const BattleImage = styled.img`
  display: block;
  margin: 0 auto;
`;

export const CenteredDiv = styled.div`
  text-align: center;
  margin: 2em 0 3em 0;
`;

export const GameStartButtons = styled.div`
  text-align: center;
  margin: 4em;
`;

export const UserProfileImage = styled.img`
  height: 25px;
  width: 25px;
  border: 2px solid #fff;
  margin-right: 15px;
  vertical-align: middle;
`;

export const Trophy = styled(FaTrophy)`
  color: #ffd600;
  vertical-align: middle;
  margin-right: 15px;
`;
