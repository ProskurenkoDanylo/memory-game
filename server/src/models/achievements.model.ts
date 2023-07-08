import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient(process.env.CONNECTION_URI);

interface Achievement {
  title: string;
  image: string;
  description: string;
}

async function getAllAchievements() {
  const database = client.db('memory-match-game');
  const achievements = database.collection<Achievement>('achievements');
  return await achievements
    .find()
    .toArray()
    .catch((err) => ({
      error: err,
    }));
}

async function getAchievementByTitle({ title }: { title: string }) {
  const database = client.db('memory-match-game');
  const achievements = database.collection<Achievement>('achievements');
  return await achievements.findOne({ title }).catch((err) => ({
    error: err,
  }));
}

async function addAchievement({ title, image, description }: Achievement) {
  const database = client.db('memory-match-game');
  const users = database.collection<Achievement>('achievements');
  return await users
    .insertOne({
      title,
      image,
      description,
    })
    .then((achievement) => achievement)
    .catch((err) => {
      return { error: err };
    });
}

async function updateAchievement(achievement) {
  const database = client.db('memory-match-game');
  const achievements = database.collection<Achievement>('achievements');
  const { _id, ...newAchievementData } = achievement;
  return await achievements
    .updateOne({ _id: new ObjectId(_id) }, { $set: newAchievementData })
    .then((achievement) => achievement)
    .catch((err) => {
      return { error: err };
    });
}

async function deleteAchievement(achievement) {
  const database = client.db('memory-match-game');
  const achievements = database.collection<Achievement>('achievements');
  return await achievements
    .deleteOne({ _id: new ObjectId(achievement._id) })
    .then((res) => res)
    .catch((err) => {
      return { error: err };
    });
}

export {
  getAllAchievements,
  getAchievementByTitle,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};
