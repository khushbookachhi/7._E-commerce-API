import mongoose from "mongoose";

// name,desc,price,imageUrl,category,sizes
export const productSchema=new mongoose.Schema({
    name:String,
    price:Number,
    imageUrl:String,
    sizes:Array,
    stock: {type:Number,
    validate:{
        validator:function(value){
            return value>=0;
        },
        message:'Stock must be a non-negative number'
    }},
    reviews:[{
        _id:false,
       user: {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
       rating:Number
    }   
    ],
    categories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Category'
        }
    ],
    userID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
})