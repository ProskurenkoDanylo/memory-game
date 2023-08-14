import { useEffect } from 'react';

import { winShoot, looseShoot } from './confetti.config';
import ButtonOrLink from '../../ui/ButtonOrLink';
import * as S from './BattleResults.style';
import { BattleResultsProps } from './BattleResultsProps';
import Text from '../../ui/Text';

const BattleResults = ({
  isWinner,
  opponentName,
  winnerScore,
}: BattleResultsProps) => {
  useEffect(() => {
    if (isWinner) {
      winShoot();
      setTimeout(winShoot, 1000);
      setTimeout(winShoot, 2000);
    } else {
      looseShoot();
      setTimeout(looseShoot, 1000);
      setTimeout(looseShoot, 2000);
    }
  }, []);

  return (
    <S.Modal>
      <S.Centered>
        {isWinner ? (
          <S.WinText>WIN</S.WinText>
        ) : (
          <S.LooseText>Loose</S.LooseText>
        )}
        {isWinner ? (
          <Text alignment="center">over</Text>
        ) : (
          <Text alignment="center">to</Text>
        )}
        <Text alignment="center">{opponentName}</Text>
        <Text alignment="center">With score: {winnerScore}</Text>
        <S.Buttons>
          <ButtonOrLink link="/game/mode" $colors="#0FB01F">
            Play again
          </ButtonOrLink>{' '}
          <ButtonOrLink link="/">Home</ButtonOrLink>
        </S.Buttons>
      </S.Centered>
    </S.Modal>
  );
};

export default BattleResults;
