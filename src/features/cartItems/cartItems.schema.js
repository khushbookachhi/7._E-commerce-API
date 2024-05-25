import mongoose, { Schema } from "mongoose";

// productID,userID,quantity,id
export const cartSchema= new Schema({
    productID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    quantity:{
        type:Number,
        validate:{
            validator:function(value){
                return value>=0;
            },
            message:'Quantity must be a non-negative number'
        }
    }
})