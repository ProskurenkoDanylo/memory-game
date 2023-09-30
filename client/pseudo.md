# Endless mode ideas:

- ~~Progressive Difficulty:~~
  ~~gameEnd event:~~
  ~~endless ?~~
  ~~continueAndAddRowAndColumn() :~~
  ~~endGame()~~

  ~~**Latest Update**~~
  ~~Fixed problems with progressive diffuclty, although more cards should be added, now everything works as it must.~~

- Shared Power-Ups:
  reveilCardsClick() -> socket.io -> agreeToReveil() or disagree();

# Superpowers ideas

- Time Freeze: stopTimer(time) -> socketIO -> translate event to another player
- Clairvoyance: reveilCards(time) -> socketIO -> translate event to another player
- Freeze card: cards > 4 ? freezeCard(id, cards, playerId) -> socketIO; create freezedMoveCounter; -> make cards with that id as forbidden for another player during next move by adding a "frozenBy" property to cards object; decreese freezedMoveCounter when the move ends.
