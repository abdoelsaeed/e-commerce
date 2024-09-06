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
exports.getAllOrder = exports.deleteOrder = exports.updateOrder = exports.getOrder = exports.getMyOrders = exports.getCountOrder = exports.getTotalSales = exports.createOrder = void 0;
const orderModel_1 = __importDefault(require("./../models/orderModel"));
const order_itemModel_1 = __importDefault(require("../models/order-itemModel"));
const factory = __importStar(require("./handleFactoryController"));
const catchAsync_1 = __importDefault(require("../errFolder/catchAsync"));
// import {IOrderItem } from './../models/order-itemModel'
const err_1 = __importDefault(require("../errFolder/err"));
exports.createOrder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orderItems = req.body.orderItems.map((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
        let newOrderItem = new order_itemModel_1.default({
            quantity: orderItem.quantity,
            product: orderItem.product,
        });
        newOrderItem = yield newOrderItem.save();
        return newOrderItem._id;
    }));
    const orderItemsIdResolved = yield Promise.all(orderItems);
    const totalPrices = yield Promise.all(orderItemsIdResolved.map((orderItemId) => __awaiter(void 0, void 0, void 0, function* () {
        const orderItem = yield order_itemModel_1.default.findById(orderItemId).populate({ path: 'product', select: 'price' });
        if (!orderItem)
            return next(new err_1.default('Not Found Order Item', 404));
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
    })));
    const totalPrice = totalPrices.reduce((a, b) => a + b, 0);
    let order = new orderModel_1.default({
        orderItems: orderItemsIdResolved,
        shippingAddress1: req.body.shippingAddress1,
        shippingAddress2: req.body.shippingAddress2,
        city: req.body.city,
        zip: req.body.zip,
        status: req.body.status,
        country: req.body.country,
        phone: req.body.phone,
        user: req.body.user,
        totalPrice: totalPrice
    });
    order = yield order.save();
    if (!order)
        return next(new err_1.default("the order can't be created", 400));
    res.status(200).json({
        status: 'success',
        data: order
    });
}));
exports.getTotalSales = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const totalSales = yield orderModel_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalSales: { $sum: '$totalPrice' }
            }
        }
    ]);
    if (!totalSales || totalSales.length === 0) {
        return next(new err_1.default('The order sales cannot be generated', 400));
    }
    res.status(200).json({
        status: 'success',
        data: totalSales[0].totalSales // لعرض قيمة الـtotalSales بشكل صحيح
    });
}));
exports.getCountOrder = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const orders = yield orderModel_1.default.countDocuments();
    if (!orders)
        return next(new err_1.default(`not found products`, 400));
    res.status(200).json({
        status: 'success',
        count: orders
    });
}));
exports.getMyOrders = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const orders = yield orderModel_1.default.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id }).sort({ 'dateOrdered': -1 });
    if (!orders || orders.length === 0)
        return next(new err_1.default('Not Found Orders', 400));
    res.status(200).json({
        status: 'success',
        orders
    });
}));
exports.getOrder = factory.getOne(orderModel_1.default, 'user', 'orderItems');
exports.updateOrder = factory.updateOne(orderModel_1.default);
exports.deleteOrder = factory.deleteOne(orderModel_1.default);
exports.getAllOrder = factory.getAll(orderModel_1.default, undefined, 'dateOrdered');
