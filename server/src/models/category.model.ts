import { MongoClient, ObjectId } from 'mongodb';
const client = new MongoClient(process.env.CONNECTION_URI);

interface Category {
  title: string;
  mainImage: string;
  imageCollection: string[];
  usage: number;
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

async function getTop10Categories() {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  return await categories
    .find()
    .sort({ usage: -1 })
    .limit(10)
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

async function addCategory({
  title,
  mainImage,
  imageCollection,
  usage,
}: Category) {
  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  return await categories
    .insertOne({
      title,
      mainImage,
      imageCollection,
      usage,
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

async function getRandomImages(categoryId: string | ObjectId, count: number) {
  const id = new ObjectId(categoryId);
  const randomImages = [];

  const database = client.db('memory-match-game');
  const categories = database.collection<Category>('categories');
  const category = await categories.findOne({ _id: id });

  if (category?.imageCollection === null) {
    return {
      error: `There is not images in this category.`,
    };
  }

  if (category.imageCollection.length < count) {
    return {
      error: `There is not enough images in collection to generate ${count} different.`,
    };
  }

  for (let imageInd = 0; imageInd < count; imageInd++) {
    let image =
      category.imageCollection[
        generateRandomNumber(category.imageCollection.length)
      ];
    if (!randomImages.includes(image)) {
      randomImages.push(image);
    } else {
      let imageInCollection = true;
      while (imageInCollection) {
        image =
          category.imageCollection[
            generateRandomNumber(category.imageCollection.length)
          ];
        if (!randomImages.includes(image)) {
          imageInCollection = false;
        }
      }
      randomImages.push(image);
    }
  }

  return randomImages;
}

function generateRandomNumber(limit: number) {
  return Math.floor(Math.random() * limit);
}

export {
  getAllCategories,
  getTop10Categories,
  getCategoryByTitle,
  searchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getRandomImages,
};
