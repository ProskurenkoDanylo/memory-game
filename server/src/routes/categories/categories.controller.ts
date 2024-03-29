import { Request, Response } from 'express';

import {
  getAllCategories,
  getCategoryByTitle,
  addCategory,
  updateCategory,
  deleteCategory,
  searchCategories,
  getTop10Categories,
  getRandomImages,
} from '../../models/category.model';

async function httpGetAllCategories(req: Request, res: Response) {
  const categories = await getAllCategories();
  res.status(200).json(categories);
}

async function httpGetTop10Categories(req: Request, res: Response) {
  const categories = await getTop10Categories();
  res.status(200).json(categories);
}

async function httpGetCategoryByTitle(req: Request, res: Response) {
  const category = await getCategoryByTitle({
    title: req.body?.title,
  });
  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404).json({
      error: 'Category not found.',
    });
  }
}

async function httpSearchCategoryByTitle(req: Request, res: Response) {
  const title = req.params?.title;
  if (!title) {
    res.status(200).json([]);
  }
  const categories = await searchCategories({
    title,
  });

  res.status(200).json(categories);
}

async function httpAddNewCategory(req: Request, res: Response) {
  const { title, mainImage, imageCollection, usage } = req.body;

  if (!title || !mainImage || !imageCollection) {
    res.status(400).json({
      error: 'Required data missing to add the category.',
    });
    return;
  }

  const category = await addCategory({
    title,
    mainImage,
    imageCollection,
    usage,
  });
  res.status(201).json(category);
}

async function httpUpdateCategory(req: Request, res: Response) {
  const category = await updateCategory({
    ...req.body.category,
  });
  res.status(200).json(category);
}

async function httpDeleteCategory(req: Request, res: Response) {
  await deleteCategory(req.body.category);
  res.status(200).json({
    category: req.body.category,
  });
}

async function httpGetRandomImagesFromCategory(req: Request, res: Response) {
  const category = String(req.query?.category);
  let amount = req.query?.amount;
  if (isNaN(+amount)) {
    res.status(400).json({
      error: 'Amount is not a number',
    });
    return;
  }
  const generatedImages = await getRandomImages(category, +amount);
  res.status(200).json(generatedImages);
}

export {
  httpGetAllCategories,
  httpGetTop10Categories,
  httpGetCategoryByTitle,
  httpSearchCategoryByTitle,
  httpAddNewCategory,
  httpUpdateCategory,
  httpDeleteCategory,
  httpGetRandomImagesFromCategory,
};
