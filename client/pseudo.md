# Endless mode ideas:

- Progressive Difficulty:
  gameEnd event:
  endless ?
  continueAndAddRowAndColumn() :
  endGame()

  ** Latest Update **
  Almost DONE. Known issue - card is matched from previous game after a new game field created. Supposed reason: Socket.io send second match event for a second player after a new game started by a first player.

- Obstacles:
  timerBeforeMove = generateRandomTimer();
  onTimerEnd = () => RandomizeCardsPositions();
- Shared Power-Ups:
  reveilCardsClick() -> socket.io -> agreeToReveil() or disagree();

# Superpowers ideas

- Time Freeze: stopTimer(time) -> socketIO -> translate event to another player
- Clairvoyance: reveilCards(time) -> socketIO -> translate event to another player
- Freeze card: cards > 4 ? freezeCard(id, cards, playerId) -> socketIO; create freezedMoveCounter; -> make cards with that id as forbidden for another player during next move by adding a "frozenBy" property to cards object; decreese freezedMoveCounter when the move ends.
