"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import User from './../models/userModel'
const userController_1 = require("./../controller/userController");
const authController_1 = require("../controller/authController");
const router = express_1.default.Router();
router.get('/count-users', authController_1.protect, userController_1.countUsers);
router.route('/signup').post(authController_1.signup);
router.post('/refreshToken', authController_1.refreshToken);
router.route('/:id').get(userController_1.getUser);
router.post('/login', authController_1.logIn);
router.post('/logout', authController_1.protect, authController_1.logout);
router.post('/forgotpassword', authController_1.forgotPassword);
router.patch('/resetpassword/:token', authController_1.resetpassword);
exports.default = router;
