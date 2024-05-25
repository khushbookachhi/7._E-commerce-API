import mongoose, { Schema } from "mongoose";

// productID,userID,quantity,id
export const orderSchema= new Schema({
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    items:[{
        productID:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        },
        title:String,
        price:Number,
        quantity:{
            type:Number,
            min:1
        },
        totalPrice:Number
    }],
    totalAmount:Number,
    orderDate:Date
})