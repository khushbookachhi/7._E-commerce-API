import mongoose, { mongo } from "mongoose";
export const userSchema=new mongoose.Schema({
    name:{type:String,maxlength:[25,"Name can't be greater than 25 characters"]}, //if fails 
    email:{
        type:String,
        unique:true,
        required:true,
        match:[/.+\@.+\../,"Please enter a valid email"]
    },
    password: {type: String, 
        required:true
        // validate:{
        //     validator: function(value){
        //         return /^(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/.test(value)
        //     },
        //     message:"Password should be between 8-12 charachetrs and have a special character"
        // }
    },
    type:{
        type:String,
         enum:['customer','seller']
        },
     products:[
            {
                type:mongoose.Schema.Types.ObjectId,
                ref:'Product'
            }
        ]

})