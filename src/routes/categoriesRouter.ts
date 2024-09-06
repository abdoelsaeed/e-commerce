import express from 'express';
import { protect,authorization } from '../controller/authController';
import {createCategory,getAllCategory,deleteCategory, getCategory, updateCategory} from './../controller/categoryController';
const router = express.Router();
router.use(protect);
router.route('/').get(getAllCategory).post(authorization,createCategory);
router.route('/:id').delete(authorization,deleteCategory).get(getCategory).patch(updateCategory);

export default router;