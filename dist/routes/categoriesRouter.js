"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controller/authController");
const categoryController_1 = require("./../controller/categoryController");
const router = express_1.default.Router();
router.use(authController_1.protect);
router.route('/').get(categoryController_1.getAllCategory).post(authController_1.authorization, categoryController_1.createCategory);
router.route('/:id').delete(authController_1.authorization, categoryController_1.deleteCategory).get(categoryController_1.getCategory).patch(categoryController_1.updateCategory);
exports.default = router;
