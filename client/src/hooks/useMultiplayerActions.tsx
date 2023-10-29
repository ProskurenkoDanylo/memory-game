import { Socket } from 'socket.io-client';

export default function useMultiplayerActions(state: any, socket: Socket) {
  const handleCardClick = (card: any, ind: number) => {
    socket.emit('cardClicked', card, ind);
  };

  // when button is clicked, emit to server to suggest to use the reveil power up
  const handleCardsReveilClick = () => {
    state?.setWaitingForPlayerDecision(true);
    socket.emit('reveilCardsSuggestion');
  };

  // when player accepts or declines the suggestion, emit to server
  const handleCardsReveilDecision = (consent: boolean) => {
    if (consent) {
      socket.emit('reveilCards');
    } else {
      state?.setReveil((prev: any) => ({ ...prev, suggested: false }));
      socket.emit('disagreeReveilCards');
    }
  };

  const handleFreezePowerUpClick = () => {
    state?.setPowers((prev: any) => ({
      ...prev,
      freezeCard: { ...prev.freezeCard, selectionMode: true },
    }));
  };

  const handlePowerUpClick = (power: string, selectedCardIndex?: number) => {
    if (power === 'freezeCard') {
      state?.setPowers((prev: any) => ({
        ...prev,
        freezeCard: { ...prev.freezeCard, selectionMode: false },
      }));
      socket.emit(power, selectedCardIndex);
    } else {
      socket.emit(power);
    }
  };

  return {
    handleCardClick,
    handleCardsReveilClick,
    handleCardsReveilDecision,
    handleFreezePowerUpClick,
    handlePowerUpClick,
  };
}
