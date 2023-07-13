import { useState } from 'react';

import { AiFillCaretDown } from 'react-icons/ai';
import { AiFillCaretUp } from 'react-icons/ai';
import { FaTrophy } from 'react-icons/fa';

import Text from '../../ui/Text';
import * as S from './History.style';

import { HistoryObject } from './History.type';

function History({ history }: { history: HistoryObject[] }) {
  const [historyHidden, setHistoryHidden] = useState(true);

  return (
    <section>
      <S.HistoryTitle>
        <Text>History</Text>
        <S.OpenHistoryButton
          onClick={() => setHistoryHidden((history) => !history)}>
          {historyHidden ? <AiFillCaretDown /> : <AiFillCaretUp />}
        </S.OpenHistoryButton>
      </S.HistoryTitle>
      {historyHidden ? null : history ? (
        <S.History>
          {history.map(({ result, opponent, scoreEarned }, ind) => (
            <>
              <div className={result}>
                <Text>
                  {ind + 1}. {result[0].toUpperCase() + result.slice(1)}
                </Text>
              </div>
              <div>
                <Text alignment="center">{opponent}</Text>
              </div>
              <div>
                <Text alignment="right">
                  <FaTrophy color="#ffd600" /> {scoreEarned}
                </Text>
              </div>
            </>
          ))}
        </S.History>
      ) : (
        <Text alignment="center">No history yet.</Text>
      )}
    </section>
  );
}
export default History;
