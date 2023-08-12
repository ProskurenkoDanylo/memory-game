import ButtonOrLink from '../../ui/ButtonOrLink';
import * as S from './BattleResults.style';
import { BattleResultsProps } from './BattleResultsProps';
import Text from '../../ui/Text';

const BattleResults = ({
  isWinner,
  opponentName,
  winnerScore,
}: BattleResultsProps) => {
  return (
    <S.Modal>
      {isWinner ? <S.WinText>WIN</S.WinText> : <S.LooseText>Loose</S.LooseText>}
      {isWinner ? (
        <Text alignment="center">over</Text>
      ) : (
        <Text alignment="center">to</Text>
      )}
      <Text alignment="center">{opponentName}</Text>
      <Text alignment="center">With score: {winnerScore}</Text>
      <ButtonOrLink link="/game/mode" $colors="#0FB01F">
        Play again
      </ButtonOrLink>{' '}
      <ButtonOrLink link="/">Home</ButtonOrLink>
    </S.Modal>
  );
};

export default BattleResults;