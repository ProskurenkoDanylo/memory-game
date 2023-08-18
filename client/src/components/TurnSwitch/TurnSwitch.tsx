import * as S from './TurnSwitch.styles';

const TurnSwitch = ({ playerTurn }: { playerTurn: boolean }) => {
  return playerTurn ? (
    <S.MyTurn color="#1f57ff" size="30" />
  ) : (
    <S.OpponentTurn color="#ff3131" size="30" />
  );
};

export default TurnSwitch;
