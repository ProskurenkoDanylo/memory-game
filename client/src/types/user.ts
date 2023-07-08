interface User {
  username: string;
  email?: string;
  password: string;
  name?: string;
  profileImg?: string;
  highestScore?: number;
  preferedCover?: string;
  preferedEffect?: string;
  achievemets?: {
    achievemnt_id: any;
    date_achieved: number;
  }[];
  history?: {
    game_id: any;
    opponent?: User;
    scoreEarned: number;
    mode: string;
    movie: string;
    result: string;
  }[];
}

export default User;
