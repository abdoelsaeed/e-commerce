import express from 'express';
import {protect,authorization} from './../controller/authController'
import {createProduct, vaildCategory, getAllProduct,getProduct,updateProduct,deleteProduct, getCountProducts, getFeatured,uploadImage,uploadImages,updateImages} from './../controller/productController'
const router = express.Router();
router.route('/').post(protect,authorization,uploadImage,vaildCategory,createProduct).get(getAllProduct);
router.route('/:id').get(getProduct).delete(protect,authorization,deleteProduct).patch(protect,authorization,updateProduct);
router.get('/get/count',protect,authorization,getCountProducts);
router.put('/gallery-images/:id',protect,authorization,uploadImages,updateImages)
router.get('/get/featured',getFeatured);
export default router;