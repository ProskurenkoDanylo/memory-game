import express from 'express';

import {
  httpGetAllCategories,
  httpGetCategoryByTitle,
  httpAddNewCategory,
  httpUpdateCategory,
  httpDeleteCategory,
  httpSearchCategoryByTitle,
  httpGetTop10Categories,
  httpGetRandomImagesFromCategory,
} from './categories.controller';

const categoriesRouter = express.Router();

categoriesRouter.get('/', httpGetAllCategories);
categoriesRouter.get('/category', httpGetCategoryByTitle);
categoriesRouter.get('/top10', httpGetTop10Categories);
categoriesRouter.get('/categories/:title', httpSearchCategoryByTitle);
categoriesRouter.post('/addNew', httpAddNewCategory);
categoriesRouter.post('/update', httpUpdateCategory);
categoriesRouter.delete('/delete', httpDeleteCategory);
categoriesRouter.get('/delete', httpDeleteCategory);
categoriesRouter.get('/randomImages', httpGetRandomImagesFromCategory);

export default categoriesRouter;
