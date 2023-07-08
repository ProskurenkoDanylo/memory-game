import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient(process.env.CONNECTION_URI);

interface Game {
  played_at: number;
  players: [ObjectId, ObjectId | 'computer'];
  total_time_played: number;
  winner: ObjectId;
}

async function getAllGames() {
  const database = client.db('memory-match-game');
  const games = database.collection<Game>('games');
  return await games
    .find()
    .toArray()
    .catch((err) => ({
      error: err,
    }));
}

async function addGame({
  played_at,
  players,
  total_time_played,
  winner,
}: Game) {
  const database = client.db('memory-match-game');
  const users = database.collection<Game>('games');
  return await users
    .insertOne({
      played_at,
      players,
      total_time_played,
      winner,
    })
    .then((game) => game)
    .catch((err) => {
      return { error: err };
    });
}

async function updateGame(game) {
  const database = client.db('memory-match-game');
  const games = database.collection<Game>('games');
  const { _id, ...newGameData } = game;
  return await games
    .updateOne({ _id: new ObjectId(_id) }, { $set: newGameData })
    .then((game) => game)
    .catch((err) => {
      return { error: err };
    });
}

async function deleteGame(game) {
  const database = client.db('memory-match-game');
  const games = database.collection<Game>('games');
  return await games
    .deleteOne({ _id: new ObjectId(game._id) })
    .then((res) => res)
    .catch((err) => {
      return { error: err };
    });
}

export { getAllGames, addGame, updateGame, deleteGame };
