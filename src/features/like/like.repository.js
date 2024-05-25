import mongoose from "mongoose";
import {likeSchema} from "./like.Schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { ObjectId } from "mongodb";


const LikeModel=mongoose.model("Like",likeSchema);
export class LikeRepository{
    async getLikes(type,id){
        return await  LikeModel.find({
            likeable:new ObjectId(id),
            on_model:type
        }).populate('user')
        .populate({path:'likeable',model:type})   //for refernces we use populate
    }
    async likeProduct(userId,productId){
        try {
           const newLike=new LikeModel({
            user:new ObjectId(userId),
            likeable:new ObjectId(productId),
            on_model:'Product'
           }) 
           await newLike.save();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something with wrong with database",500);   
        }
    }
    async likeCategory(userId,categoryId){
        try {
           const newLike=new LikeModel({
            user:new ObjectId(userId),
            likeable:new ObjectId(categoryId),
            on_model:'Category'
           }) 
           await newLike.save();
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something with wrong with database",500);   
        }
    }
}
