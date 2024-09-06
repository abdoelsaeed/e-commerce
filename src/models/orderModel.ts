import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema({
    orderItems:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'OrderItem',
        require:true
    }],
    shippingAddress1:{
        type:String,
        required:[true,'you must put a shipping address']
    }
    ,
    shippingAddress2:String,
    city:{
        type:String,
        required:true
    },
    zip:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    phone:{
        type: String,
        required:true
    },
    status:{
        type:String,
        required:true,
        default:'Pending'
    },
    totalPrice:Number,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    dateOrdered:{
        type:Date,
        default:Date.now()
    }
});
const Order = mongoose.model('Order', orderSchema);
export default Order;