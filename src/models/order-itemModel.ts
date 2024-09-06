import mongoose from 'mongoose';
import { Document } from 'mongoose';
import {IProduct} from './productModel'

export interface IOrderItem extends Document {
  quantity: number;
  product: IProduct;
}
const orderItemSchema = new mongoose.Schema<IOrderItem>({
    quantity:{
        type: Number,
        required: [true,'you must put at least one item']
    },
    product:{
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    }
});
const OrderItem = mongoose.model<IOrderItem>('OrderItem',orderItemSchema);
export default OrderItem;