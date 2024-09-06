import * as factory from './handleFactoryController';
import Product from './../models/productModel';
import Category from '../models/categoryModel';
import AppError from '../errFolder/err';
import multer from 'multer';
import {Request,Response, NextFunction } from 'express';
import catchAsync from '../errFolder/catchAsync';
import path from 'path';
const FILE_TYPE_MAP:any = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpeg',
  'image/png': 'png',
};
const storage = multer.diskStorage({
  destination: function(req,file,cb){
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError:any = new AppError('invalid image type',400);
    if(isValid){
      uploadError = null;
    }
    cb(uploadError, path.join(__dirname, '..', '..', 'public', 'uploads'))
  },
  filename: function(req, file, cb){
    const filename = file.originalname.replace(/\s+/g, '-'); // استبدال المسافات بشرطة
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null,`${filename}-${Date.now()}.${extension}`);
  }
});
const uploadOptions = multer({storage: storage});
export const vaildCategory = catchAsync(async(req: Request, res: Response, next: NextFunction) => {
    if (!req.body.category) {
        return next(new AppError('Category ID is required', 400));
    }

    const category = await Category.findById(req.body.category);
    if (category) return next();
    
    return next(new AppError(`Not found category with id ${req.body.category}`, 400));
});

export const uploadImage = uploadOptions.single('image');
export const uploadImages = uploadOptions.array('images',10);
export const createProduct = factory.createOne(Product);
export const getProduct = factory.getOne(Product,'category');
export const updateProduct = factory.updateOne(Product);
export const deleteProduct = factory.deleteOne(Product);

export const getAllProduct =   catchAsync(async(req:Request, res:Response,next:NextFunction) => {
  let filter: string[] = []; // Initialize filter as an empty array

  if (typeof req.query.categories === 'string') {
    filter = req.query.categories.split(',');
  }
 const query = filter.length > 0 ? { category: { $in: filter } } : {}; 
const items =  await Product.find(query).select('name -_id');
  if(items.length === 0){
    return next(new AppError('Not Found Category',404));
  }
  res.status(200).json({ 
      status: 'success',
      results: items.length,
      data: {
        items
      }
    });
  });

export const getCountProducts = catchAsync(async(req:Request, res: Response,next: NextFunction) =>{
    const products = await Product.countDocuments();
    if(!products) return next(new AppError(`not found products`,400));
    res.status(200).json({
        status:'success',
        count: products
    });
});
export const getFeatured = catchAsync(async(req:Request, res: Response,next: NextFunction) =>{
    const count = req.query.count?+req.query.count:0;
    const products = await Product.find({isFeatured:true}).limit(count);
    if(!products) return next(new AppError(`not found products`,400));
    res.status(200).json({
        status:'success',
        result: products
    });
});
export const updateImages = catchAsync(async(req:Request, res: Response,next: NextFunction) =>{
  const product = await Product.findById(req.params?.id);
  if(!product) return next(new AppError(`not found product`,400));
  const files:any=req.files;
  let imagesPath:string[]=[];
  const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
  if(files){
    files.map((file:any) =>{
      console.log(file);
      imagesPath.push(`${basePath}${file.filename}`)
    })
  }
  product.images = imagesPath;
  await product.save();
  res.status(200).json({
    status:'success',
    data: product
  });
});