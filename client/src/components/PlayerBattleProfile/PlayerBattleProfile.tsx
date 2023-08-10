import { FaFire } from 'react-icons/fa';
import CountUp from 'react-countup';

import * as S from './PlayerBattleProfile.style';

import { PlayerBattleProfileProps } from './PlayerBattleProfileProps';
import Text from '../../ui/Text';

const PlayerBattleProfile = ({
  score,
  comboScore,
  playerName,
  playerProfileImg,
  playerAchievements,
  align,
  playerTurn,
}: PlayerBattleProfileProps) => {
  return (
    <S.Flex align={align} playerTurn={playerTurn}>
      <S.ProfileImg
        src={playerProfileImg}
        alt={`${playerName} profile picture`}
      />
      <div>
        <Text fontWeight="bold">
          <FaFire color="#FF7A00" />{' '}
          <S.Score>
            <CountUp start={0} end={score} delay={0} preserveValue />
            {comboScore > 0 && (
              <S.ComboScore key={comboScore} className="fade-out">
                {` + ${comboScore}`}
              </S.ComboScore>
            )}
          </S.Score>
        </Text>
        <S.PlayerBoard>
          <Text
            color={align === 'left' ? '#1f57ff' : '#ff3131'}
            fontWeight="bold">
            {playerName}
          </Text>
          {playerAchievements.length ? (
            playerAchievements.map((achievement) => (
              <S.Achievement src={achievement.src} alt={achievement.text} />
            ))
          ) : (
            <Text color="#808080">No achievements yet.</Text>
          )}
        </S.PlayerBoard>
      </div>
    </S.Flex>
  );
};

export default PlayerBattleProfile;
