"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    orderItems: [{
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'OrderItem',
            require: true
        }],
    shippingAddress1: {
        type: String,
        required: [true, 'you must put a shipping address']
    },
    shippingAddress2: String,
    city: {
        type: String,
        required: true
    },
    zip: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    totalPrice: Number,
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    dateOrdered: {
        type: Date,
        default: Date.now()
    }
});
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
