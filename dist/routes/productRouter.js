"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("./../controller/authController");
const productController_1 = require("./../controller/productController");
const router = express_1.default.Router();
router.route('/').post(authController_1.protect, authController_1.authorization, productController_1.uploadImage, productController_1.vaildCategory, productController_1.createProduct).get(productController_1.getAllProduct);
router.route('/:id').get(productController_1.getProduct).delete(authController_1.protect, authController_1.authorization, productController_1.deleteProduct).patch(authController_1.protect, authController_1.authorization, productController_1.updateProduct);
router.get('/get/count', authController_1.protect, authController_1.authorization, productController_1.getCountProducts);
router.put('/gallery-images/:id', authController_1.protect, authController_1.authorization, productController_1.uploadImages, productController_1.updateImages);
router.get('/get/featured', productController_1.getFeatured);
exports.default = router;
