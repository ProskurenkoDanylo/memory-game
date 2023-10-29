import { createPortal } from 'react-dom';
import socketIOClient from 'socket.io-client';

import useMultiplayerState from '../../hooks/useMultiplayerState';
import useMultiplayerEffects from '../../hooks/useMultiplayerEffects';
import useMultiplayerActions from '../../hooks/useMultiplayerActions';
import * as Helpers from '../../utils/multiplayerHelperFunctions';

import Modal from '../../ui/Modal/Modal';
import Container from '../../ui/Container';
import TurnSwitch from '../../components/TurnSwitch';
import BattleResults from '../../components/BattleResults';
import Suggestion from '../../components/Suggestion';

import GameConfig from '../../types/gameConfig';

import * as S from './GameScreen.style';
import defaultCover from '../../assets/images/default-cover.svg';

const socket = socketIOClient('https://localhost:3000', {
  autoConnect: false,
});

const Multiplayer = ({ gameConfig }: { gameConfig: GameConfig | null }) => {
  const state = useMultiplayerState(socket);
  useMultiplayerEffects(gameConfig, state, socket);
  const {
    handleCardClick,
    handleCardsReveilClick,
    handleCardsReveilDecision,
    handleFreezePowerUpClick,
    handlePowerUpClick,
  } = useMultiplayerActions(state, socket);

  return (
    <Container>
      {/* Render the battle results modal if the game has ended */}
      {state?.results !== null
        ? createPortal(
            <Modal canClose={false}>
              <BattleResults
                results={state.results}
                winnerScore={Helpers.calculateWinnersScore(
                  state.results,
                  state.stats
                )}
                opponentName={Helpers.getPlayerName(state?.opponent)}
              />
            </Modal>,
            document.body
          )
        : null}
      {/* Render the bomb component with animation based on timer end */}
      <S.Bomb
        animate={Helpers.isTimerEnd(
          state?.game,
          state?.playerTimer,
          state?.opponentTimer
        )}
      />
      <S.Flex>
        {/* Render the player battle profile if the user exists */}
        {state?.user &&
          Helpers.createPlayerBattleProfile({
            player: state?.user,
            state,
            handleFreezePowerUpClick,
            handleCardsReveilClick,
            handlePowerUpClick,
          })}
        {/* Render the waiting for opponent's response modal if waiting for player decision */}
        {state?.waitingForPlayerDecision && !state.reveil.used ? (
          <Modal
            closeCallback={() => {
              handleCardsReveilDecision(false);
            }}>
            <S.Suggestion>Waiting for opponent's response...</S.Suggestion>
          </Modal>
        ) : null}
        {/* Render the suggestion component if opponent suggests to use the Reveil power up */}
        {state?.reveil.suggested ? (
          <Suggestion
            acceptCallback={() => handleCardsReveilDecision(true)}
            declineCallback={() => handleCardsReveilDecision(false)}>
            Opponent suggests to use the Reveil power up.
          </Suggestion>
        ) : null}
        <div>
          {/* Render the turn switch component if the opponent exists */}
          {state?.opponent ? (
            <>
              <TurnSwitch playerTurn={state.playerTurn} />
            </>
          ) : (
            <S.WaitingForPlayer>Matching{state.dots}</S.WaitingForPlayer>
          )}
        </div>
        {Helpers.createPlayerBattleProfile({
          player: state?.opponent,
          state,
          handleFreezePowerUpClick,
          handleCardsReveilClick,
          handlePowerUpClick,
        })}
      </S.Flex>
      {/* Render the game board with the size based on the square root of the number of cards */}
      <S.GameBoard size={state?.game && Math.sqrt(state?.game.cards.length)}>
        {state?.game &&
          state.game.cards.map((card: any, cardIndex: number) => (
            <S.CardStyled
              key={cardIndex + card.image}
              border={{
                borderColor: '#fff',
                borderWidth: 2,
                borderStyle: 'solid',
              }}
              frontIconURL={defaultCover}
              /* Preventing cheaters from using web dev tools to see what card is it */
              back={
                state?.cardsActive.includes(cardIndex) || state?.reveil?.on
                  ? card.image
                  : defaultCover
              }
              opened={card.opened}
              selectionMode={state?.powers.freezeCard.selectionMode}
              frozen={card.frozen}
              disabled={state?.opponent ? card.disabled : true}
              onClick={Helpers.CardActions({
                powers: state?.powers,
                reveil: state?.reveil,
                cardsActive: state?.cardsActive,
                playerTurn: state?.playerTurn,
                cardIndex,
                card,
                handleCardClick,
                handlePowerUpClick,
              })}
            />
          ))}
      </S.GameBoard>
    </Container>
  );
};

export default Multiplayer;
