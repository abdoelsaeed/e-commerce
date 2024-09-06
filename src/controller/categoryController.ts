import Category from './../models/categoryModel';
import {createOne, getAll, deleteOne, getOne, updateOne} from './handleFactoryController';

export const createCategory = createOne(Category);
export const getAllCategory = getAll(Category)
export const deleteCategory = deleteOne(Category);
export const getCategory = getOne(Category);
export const updateCategory = updateOne(Category);