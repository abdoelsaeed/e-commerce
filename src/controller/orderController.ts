import Order from './../models/orderModel';
import OrderItem from '../models/order-itemModel';
import {Request,Response, NextFunction } from 'express';
import * as factory from './handleFactoryController';
import catchAsync from '../errFolder/catchAsync';
// import {IOrderItem } from './../models/order-itemModel'
import AppError from '../errFolder/err';
import { ObjectId } from 'mongoose';
export const createOrder = catchAsync(async(req:Request, res:Response,next:NextFunction) => {
    const orderItems = req.body.orderItems.map(async(orderItem:any)=>{
        let newOrderItem = new OrderItem({
            quantity: orderItem.quantity,
            product: orderItem.product,
            
        });
        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    });
    const orderItemsIdResolved = await Promise.all(orderItems);
    const totalPrices = await Promise.all(orderItemsIdResolved.map(async(orderItemId:ObjectId)=>{
        const orderItem:any  = await OrderItem.findById(orderItemId).populate({path:'product',select:'price'});
        
       if(!orderItem)return next(new AppError('Not Found Order Item',404));
       const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    }));
        const totalPrice = totalPrices.reduce((a:number,b:any) => a + b,0)
    let order = new Order({
        orderItems:orderItemsIdResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        status:req.body.status,
        country:req.body.country,
        phone:req.body.phone,
        user:req.body.user,
        totalPrice:totalPrice
    });
    order = await order.save();
    if(!order)return next(new AppError("the order can't be created",400));
    res.status(200).json({
        status:'success',
        data: order
    });
});

export const getTotalSales = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const totalSales = await Order.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: '$totalPrice' }
            }
        }
    ]);

    if (!totalSales || totalSales.length === 0) {
        return next(new AppError('The order sales cannot be generated', 400));
    }

    res.status(200).json({
        status: 'success',
        data: totalSales[0].totalSales // لعرض قيمة الـtotalSales بشكل صحيح
    });
});

export const getCountOrder = catchAsync(async(req:Request, res: Response,next: NextFunction) =>{
    const orders = await Order.countDocuments();
    if(!orders) return next(new AppError(`not found products`,400));
    res.status(200).json({
        status:'success',
        count: orders
    });
});

export const getMyOrders = catchAsync(async(req:Request, res: Response,next: NextFunction) =>{
    const orders = await Order.find({user:req.user?.id}).sort({'dateOrdered':-1});
    if(!orders||orders.length===0) return next(new AppError('Not Found Orders', 400));
        res.status(200).json({
        status:'success',
        orders
    });
});

export const getOrder = factory.getOne(Order,'user','orderItems');
export const updateOrder = factory.updateOne(Order);
export const deleteOrder = factory.deleteOne(Order);
export const getAllOrder = factory.getAll(Order,undefined,'dateOrdered');