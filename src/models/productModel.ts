import mongoose from 'mongoose';
import { Document, Types } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    image: string;
    images: string[];
    brand: string;
    price: number;
    category: Types.ObjectId;
    countInStock: number;
    description: string;
    richDescription: string;
    rating: number;
    numReviews: number;
    isFeatured: boolean;
    dateCreated: Date;
    ratingsAverage: number;
}

const ProductSchema = new mongoose.Schema<IProduct>({
    name: {
        type: String,
        required:[true, 'Please inter the name']
    },
    image:{
        type:String,
        default:''
    },
    images:[
        {
        type:String,
        default:''
    }
],
    brand:{
        type: String,
        default: ''
    },
    price:{
        type:Number,
        default: 0
    },
    category:{
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: true
    },
    countInStock:{
        type: Number,
        required: true,
        min:0,
        max:255
    },
    description:{
        type:String,
        required: true
    },
    richDescription:{
        type:String,
        default:''
    },
    rating:{
        type: Number,
        default:0,
    },
    numReviews:{
        type: Number,
        default:0
    },
    isFeatured:{
        type:Boolean,
        default: false
    }, 
    dateCreated:{
        type: Date,
        default: Date.now
    },

    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: 1,
        max: 5,
      //set عشان الارقام العشريه
        set: (val:number) => Math.round(val * 10) / 10 //4.666667 = 4.7
    }
},

); 
const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;