import express from 'express';
// import User from './../models/userModel'
import {getUser,countUsers} from './../controller/userController';
import { logIn,refreshToken,signup,logout,forgotPassword,protect,resetpassword } from '../controller/authController';
const router = express.Router();
router.get('/count-users',protect ,countUsers);
router.route('/signup').post(signup);
router.post('/refreshToken', refreshToken);
router.route('/:id').get(getUser);
router.post('/login',logIn);
router.post('/logout',protect,logout);
router.post('/forgotpassword',forgotPassword);
router.patch('/resetpassword/:token',resetpassword);
export default router;