export interface PlayerBattleProfileProps {
  score: number;
  comboScore: number;
  playerName: string;
  playerProfileImg: string;
  playerAchievements: {
    src: string;
    text: string;
  }[];
  align: 'left' | 'right';
  playerTurn: boolean;
  timer?: {
    seconds: number;
    minutes: number;
  };
  powers?: {
    reveil?: {
      handler: () => void;
      used: boolean;
    };
  };
}
