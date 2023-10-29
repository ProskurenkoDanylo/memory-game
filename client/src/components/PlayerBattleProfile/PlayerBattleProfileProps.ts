type PowerConfig = {
  handler: () => void;
  used: boolean;
  title: string;
  icon: any;
};

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
    time: {
      seconds: number;
      minutes: number;
    } | null;
    frozen: boolean | undefined;
  };
  powers?: { [key: string]: PowerConfig } | null;
}
