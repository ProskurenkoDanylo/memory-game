import { useEffect } from 'react';

import { winShoot, looseShoot } from './confetti.config';
import ButtonOrLink from '../../ui/ButtonOrLink';
import * as S from './BattleResults.style';
import { BattleResultsProps } from './BattleResultsProps';
import Text from '../../ui/Text';

const BattleResults = ({
  results,
  opponentName,
  winnerScore,
}: BattleResultsProps) => {
  useEffect(() => {
    if (results === 'won') {
      winShoot();
      setTimeout(winShoot, 1000);
      setTimeout(winShoot, 2000);
    } else if (results === 'loose') {
      looseShoot();
      setTimeout(looseShoot, 1000);
      setTimeout(looseShoot, 2000);
    }
  }, []);

  return (
    <S.Centered>
      {results === 'won' ? (
        <S.WinText>WIN</S.WinText>
      ) : results === 'loose' ? (
        <S.LooseText>Loose</S.LooseText>
      ) : (
        <S.DrawText>Draw</S.DrawText>
      )}
      {opponentName && !(results === 'draw') ? (
        results === 'won' ? (
          <Text alignment="center">over</Text>
        ) : (
          <Text alignment="center">to</Text>
        )
      ) : null}
      {opponentName ? (
        <>
          <Text alignment="center">{opponentName}</Text>
          <Text alignment="center">With score: {winnerScore}</Text>
        </>
      ) : (
        <Text alignment="center">Score: {winnerScore}</Text>
      )}
      <S.Buttons>
        <ButtonOrLink
          // if opponentName is not null, it means that the game was multiplayer
          link={`${opponentName ? '/game/mode' : '/game/category'}`}
          $colors="#0FB01F">
          Play again
        </ButtonOrLink>{' '}
        <ButtonOrLink link="/">Home</ButtonOrLink>
      </S.Buttons>
    </S.Centered>
  );
};

export default BattleResults;
