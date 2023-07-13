export interface HistoryObject {
  game_id: string;
  opponent?: string;
  scoreEarned: number;
  mode: string;
  movie: string;
  result: 'win' | 'lose' | 'draw';
}
