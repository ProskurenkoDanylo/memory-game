import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient(process.env.CONNECTION_URI);

interface Category {
  title: string;
  mainImage: string;
  imageCollection: string[];
}

async function getAllCategories() {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  return await categories
    .find()
    .toArray()
    .catch((err) => ({
      error: err,
    }));
}

async function getCategoryByTitle({ title }: { title: string }) {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  return await categories.findOne({ title }).catch((err) => ({
    error: err,
  }));
}

async function searchCategories({ title }: { title: string }) {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regexTitle = new RegExp(escapedTitle, 'i');
  return await categories
    .aggregate([
      {
        $match: {
          title: regexTitle,
        },
      },
    ])
    .toArray();
}

async function addCategory({ title, mainImage, imageCollection }: Category) {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  return await categories
    .insertOne({
      title,
      mainImage,
      imageCollection,
    })
    .then((category) => category)
    .catch((err) => {
      return { error: err };
    });
}

async function updateCategory(category) {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  const { _id, ...newCategoryData } = category;
  return await categories
    .updateOne({ _id: new ObjectId(_id) }, { $set: newCategoryData })
    .then((category) => category)
    .catch((err) => {
      return { error: err };
    });
}

async function deleteCategory(category) {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  return await categories
    .deleteOne({ _id: new ObjectId(category._id) })
    .then((res) => res)
    .catch((err) => {
      return { error: err };
    });
}

export {
  getAllCategories,
  getCategoryByTitle,
  searchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
