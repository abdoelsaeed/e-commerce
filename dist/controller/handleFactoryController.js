"use strict";
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
exports.updateOne = exports.getOne = exports.deleteOne = exports.getAll = exports.createOne = void 0;
const err_1 = __importDefault(require("./../errFolder/err"));
const catchAsync_1 = __importDefault(require("../errFolder/catchAsync"));
const createOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if ((_a = req.file) === null || _a === void 0 ? void 0 : _a.filename) {
        console.log(123);
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        req.body.image = `${basePath}${(_b = req.file) === null || _b === void 0 ? void 0 : _b.filename}`;
    }
    console.log(req.file);
    let item = new Model(req.body);
    item = yield item.save();
    res.status(200).json({
        status: 'success',
        message: item
    });
}));
exports.createOne = createOne;
const getAll = (Model, select, sortt) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const items = select ? yield Model.find().select('name -_id') : yield Model.find().sort({ [sortt]: -1 });
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
exports.getAll = getAll;
const deleteOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Model.findByIdAndDelete(req.params.id);
    console.log(item);
    if (!item) {
        return next(new err_1.default('Not Found Item', 404));
    }
    res.status(200).json({
        status: 'success',
        message: null
    });
}));
exports.deleteOne = deleteOne;
const getOne = (Model, populatee, populateee) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const item = populatee
        ? populateee
            ? yield Model.findById(req.params.id)
                .populate({ path: populatee, select: 'name -_id' })
                .populate({ path: populateee,
                populate: { path: 'product', select: 'name category',
                    populate: { path: 'category', select: 'name -_id' } } })
            : yield Model.findById(req.params.id).populate({ path: populatee, select: 'name -_id' })
        : yield Model.findById(req.params.id);
    if (!item) {
        return next(new err_1.default('Not Found Item', 400));
    }
    res.status(200).json({
        status: 'success',
        data: item
    });
}));
exports.getOne = getOne;
const updateOne = (Model) => (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    if (!item) {
        return next(new err_1.default('Not Found Item', 404));
    }
    res.status(200).json({
        status: 'success',
        data: item
    });
}));
exports.updateOne = updateOne;
