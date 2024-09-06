"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCategory = exports.getCategory = exports.deleteCategory = exports.getAllCategory = exports.createCategory = void 0;
const categoryModel_1 = __importDefault(require("./../models/categoryModel"));
const handleFactoryController_1 = require("./handleFactoryController");
exports.createCategory = (0, handleFactoryController_1.createOne)(categoryModel_1.default);
exports.getAllCategory = (0, handleFactoryController_1.getAll)(categoryModel_1.default);
exports.deleteCategory = (0, handleFactoryController_1.deleteOne)(categoryModel_1.default);
exports.getCategory = (0, handleFactoryController_1.getOne)(categoryModel_1.default);
exports.updateCategory = (0, handleFactoryController_1.updateOne)(categoryModel_1.default);
