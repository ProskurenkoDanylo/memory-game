import { useRef } from 'react';
import { FaFire } from 'react-icons/fa';
import CountUp from 'react-countup';

import * as S from './PlayerBattleProfile.style';

import { PlayerBattleProfileProps } from './PlayerBattleProfileProps';
import Text from '../../ui/Text';
import userSearchGif from '../../assets/images/user-search.gif';
import bombIcon from '../../assets/images/bomb.png';

const PlayerBattleProfile = ({
  score,
  comboScore,
  playerName,
  playerProfileImg,
  playerAchievements,
  align,
  playerTurn,
  timer,
  powers,
}: PlayerBattleProfileProps) => {
  const bombIconRef = useRef(null);

  return (
    <S.Flex
      align={align}
      playerTurn={playerTurn}
      playerHere={Boolean(playerName)}>
      <S.ProfileImg
        src={playerProfileImg || userSearchGif}
        alt={
          playerName
            ? `${playerName} profile picture`
            : 'Searching for opponent'
        }
      />
      <div>
        <Text fontWeight="bold">
          <FaFire color={playerName ? '#FF7A00' : '#9000ff'} />{' '}
          <S.Score>
            <CountUp start={0} end={score} delay={0} preserveValue />
            {comboScore > 0 && (
              <S.ComboScore key={comboScore} className="fade-out">
                {` + ${comboScore}`}
              </S.ComboScore>
            )}
          </S.Score>
          {timer?.time ? (
            <S.Timer frozen={timer.frozen}>
              <S.BombIcon ref={bombIconRef} src={bombIcon} alt="" />{' '}
              {timer?.time?.minutes}:{timer?.time?.seconds}
            </S.Timer>
          ) : null}
        </Text>
        <S.PlayerBoard>
          <Text
            color={
              playerName
                ? align === 'left'
                  ? '#1f57ff'
                  : '#ff3131'
                : '#9000ff'
            }
            fontWeight="bold">
            {playerName || '??? ??? ???'}
          </Text>
          {playerAchievements.length ? (
            playerAchievements.map((achievement) => (
              <S.Achievement src={achievement.src} alt={achievement.text} />
            ))
          ) : (
            <Text color="#808080">
              {playerName ? 'No achievements yet.' : '??? ??? ???'}
            </Text>
          )}
        </S.PlayerBoard>

        <S.Powers>
          {powers &&
            Object.keys(powers).map((power) => {
              return (
                <S.PowerButton
                  key={power}
                  used={powers[power as keyof typeof powers]?.used}
                  title={powers[power as keyof typeof powers]?.title}
                  onClick={powers[power as keyof typeof powers]?.handler}>
                  {powers[power as keyof typeof powers]?.icon}
                </S.PowerButton>
              );
            })}
        </S.Powers>
      </div>
    </S.Flex>
  );
};

export default PlayerBattleProfile;
