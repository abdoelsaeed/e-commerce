import * as factory from './handleFactoryController';
import {Request,Response, NextFunction } from 'express';
import catchAsync from '../errFolder/catchAsync';
import AppError from '../errFolder/err';
import User from './../models/userModel';
export const getUser = factory.getOne(User);
export const countUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const count = await User.countDocuments();
    if (count === 0) {
        return next(new AppError('No users found', 404));
    }

    res.status(200).json({
        status: 'success',
        results: count,
        data: {
            users: [],
        },
    });
});