import express from 'express';

import {
  httpGetAllCategories,
  httpGetCategoryByTitle,
  httpAddNewCategory,
  httpUpdateCategory,
  httpDeleteCategory,
} from './categories.controller';

const categoriesRouter = express.Router();

categoriesRouter.get('/', httpGetAllCategories);
categoriesRouter.get('/category', httpGetCategoryByTitle);
categoriesRouter.post('/addNew', httpAddNewCategory);
categoriesRouter.post('/update', httpUpdateCategory);
categoriesRouter.delete('/delete', httpDeleteCategory);

export default categoriesRouter;
