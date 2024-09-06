"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateImages = exports.getFeatured = exports.getCountProducts = exports.getAllProduct = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.createProduct = exports.uploadImages = exports.uploadImage = exports.vaildCategory = void 0;
const factory = __importStar(require("./handleFactoryController"));
const productModel_1 = __importDefault(require("./../models/productModel"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const err_1 = __importDefault(require("../errFolder/err"));
const multer_1 = __importDefault(require("multer"));
const catchAsync_1 = __importDefault(require("../errFolder/catchAsync"));
const path_1 = __importDefault(require("path"));
const FILE_TYPE_MAP = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
};
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new err_1.default('invalid image type', 400);
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, path_1.default.join(__dirname, '..', '..', 'public', 'uploads'));
    },
    filename: function (req, file, cb) {
        const filename = file.originalname.replace(/\s+/g, '-'); // استبدال المسافات بشرطة
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${filename}-${Date.now()}.${extension}`);
    }
});
const uploadOptions = (0, multer_1.default)({ storage: storage });
exports.vaildCategory = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.category) {
        return next(new err_1.default('Category ID is required', 400));
    }
    const category = yield categoryModel_1.default.findById(req.body.category);
    if (category)
        return next();
    return next(new err_1.default(`Not found category with id ${req.body.category}`, 400));
}));
exports.uploadImage = uploadOptions.single('image');
exports.uploadImages = uploadOptions.array('images', 10);
exports.createProduct = factory.createOne(productModel_1.default);
exports.getProduct = factory.getOne(productModel_1.default, 'category');
exports.updateProduct = factory.updateOne(productModel_1.default);
exports.deleteProduct = factory.deleteOne(productModel_1.default);
exports.getAllProduct = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let filter = []; // Initialize filter as an empty array
    if (typeof req.query.categories === 'string') {
        filter = req.query.categories.split(',');
    }
    const query = filter.length > 0 ? { category: { $in: filter } } : {};
    const items = yield productModel_1.default.find(query).select('name -_id');
    if (items.length === 0) {
        return next(new err_1.default('Not Found Category', 404));
    }
    res.status(200).json({
        status: 'success',
        results: items.length,
        data: {
            items
        }
    });
}));
exports.getCountProducts = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.countDocuments();
    if (!products)
        return next(new err_1.default(`not found products`, 400));
    res.status(200).json({
        status: 'success',
        count: products
    });
}));
exports.getFeatured = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const count = req.query.count ? +req.query.count : 0;
    const products = yield productModel_1.default.find({ isFeatured: true }).limit(count);
    if (!products)
        return next(new err_1.default(`not found products`, 400));
    res.status(200).json({
        status: 'success',
        result: products
    });
}));
exports.updateImages = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const product = yield productModel_1.default.findById((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
    if (!product)
        return next(new err_1.default(`not found product`, 400));
    const files = req.files;
    let imagesPath = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    if (files) {
        files.map((file) => {
            console.log(file);
            imagesPath.push(`${basePath}${file.filename}`);
        });
    }
    product.images = imagesPath;
    yield product.save();
    res.status(200).json({
        status: 'success',
        data: product
    });
}));
