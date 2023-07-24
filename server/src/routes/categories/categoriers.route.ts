import express from 'express';

import {
  httpGetAllCategories,
  httpGetCategoryByTitle,
  httpAddNewCategory,
  httpUpdateCategory,
  httpDeleteCategory,
  httpSearchCategoryByTitle,
  httpGetTop10Categories,
} from './categories.controller';

const categoriesRouter = express.Router();

categoriesRouter.get('/', httpGetAllCategories);
categoriesRouter.get('/category', httpGetCategoryByTitle);
categoriesRouter.get('/top10', httpGetTop10Categories);
categoriesRouter.get('/categories/:title', httpSearchCategoryByTitle);
categoriesRouter.post('/addNew', httpAddNewCategory);
categoriesRouter.post('/update', httpUpdateCategory);
categoriesRouter.delete('/delete', httpDeleteCategory);

export default categoriesRouter;