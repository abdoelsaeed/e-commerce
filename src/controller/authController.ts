import User ,  {IUser}  from './../models/userModel';
import  jwt  from 'jsonwebtoken';
import AppError from '../errFolder/err';
import bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import Email from './../email/email';
import {Request,Response, NextFunction } from 'express';
import catchAsync from '../errFolder/catchAsync';
const generateAccessToken = (user:IUser) => {
  return jwt.sign({ id: user._id, username: user.name }, 'ACCESS_TOKEN_SECRET', {
    expiresIn: '15m',
  });
};
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // يمكنك تعديل النوع إذا كان لديك نوع مخصص للـ user
    }
  }
}
const generateRefreshToken = (user:IUser) => {
  return jwt.sign({ id: user._id, username: user.name }, 'REFRESH_TOKEN_SECRET');
};
export const logIn = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    let { email, password } = req.body;
     if (!email || !password) {
    return next(new AppError('please provide email and password!', 400));
  }
    if(typeof password === 'number')password = password.toString();
    const user = await User.findOne({ email }).select('password');

    if(!user||!(await bcrypt.compare(password, user.password))){
        return next(new AppError('Incorrect email or password',400))
    }
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken
    });
});

export const protect = catchAsync(async(req:Request,res:Response,next:NextFunction) => {
    let token:string|undefined;
     if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {
    token = req.cookies.jwt;
    }
    if (!token) {
        return next(new AppError('You are not logged in', 401));
    }
    jwt.verify(token, 'ACCESS_TOKEN_SECRET',async (err:any,decoded:any)=>{
    if (err) {
            return next(new AppError('Invalid token or token expired', 403));
        }
        console.log(decoded.id)
          const currentUser = await User.findById(decoded.id);
          if (!currentUser) {
          return next(
            new AppError('the user belonging to this token does not exist', 401)
          );
        }
        
        if (currentUser.changePasswordAfter(decoded.iat)) {
          return next(
            new AppError('Your password has changed! please login again', 401)
          );
        }
        req.user = decoded;
        next();
});
});

export const refreshToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return next(new AppError('No refresh token provided', 401));
    }
    const user = await User.findOne({refreshToken});
    if(!user){
        return next(new AppError('Invalid refresh token', 403));
    }
    jwt.verify(refreshToken,'REFRESH_TOKEN_SECRET',(err: any, decoded: any) => {
        if (err) {
            return next(new AppError('Invalid refresh token', 403));
        }
        const newAccessToken = generateAccessToken(user);

        res.status(200).json({
            status: 'success',
            accessToken: newAccessToken,
        });
    });
});
export const authorization =catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user:any = await User.findById(req.user?.id);
    console.log(user.isAdmin)
    if(!user.isAdmin){
      return next(new AppError('You are not authorized to access this route', 403));
    }
    next();
});
export const signup = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create(req.body);
    const url = '12';
    await new Email(newUser, url).sendWelcome();
    const accessToken = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);
    newUser.refreshToken = refreshToken;
    await newUser.save({ validateBeforeSave: false });
    res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(200).json({
        status: 'success',
        accessToken,
        refreshToken,
        data:{
          newUser
        }
    });
});
export const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const id =req.user?.id;
  const user = await User.findById(id);
  if(user)   {
      user.refreshToken= undefined;
      await user.save({validateBeforeSave:false});
  }
  res.clearCookie('accessToken');
  res.status(200).json({ status: 'Logged out!' });
});
export const forgotPassword= catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const user = await User.findOne({email:req.body.email});
  if(!user) return next(new AppError(`There is no user with email ${req.body.email}`, 404));
  const resetToken = user.createPasswordRestToken();
  await user.save({ validateBeforeSave: false });
try {
    const restURL = `http://127.0.0.1:3000/api/v1/users/resetpassword/${resetToken}`;
    await new Email(user, restURL).sendPasswordReset();
    res.status(200).json({
      status: 'success',
      acessToken:resetToken,
      message: 'Token send to email !'
    });
  } catch (err:any) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.log(err.message);
    return next(
      new AppError(
        'There was an error sending this email. Try again later!',
        500
      )
    );
  }
});

export const resetpassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    }); 
    console.log(user)
      if (!user) {
        return next(new AppError('Token is invalid or expired', 400));
      }
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false});
    
    res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000 // 15 minutes
    });
    res.status(200).json({
      ststus:'sucess',
      message:'Done'
    });
});