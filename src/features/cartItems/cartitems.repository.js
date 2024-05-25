import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { cartSchema } from "./cartItems.schema.js";
import mongoose from "mongoose";

const CartItemModel=mongoose.model("CartItems",cartSchema);

export default class CartItemsRepository{
    constructor(){
        this.collection="cartItems";
    }
async add(productID,userID){
    try {
    // const id=await this.getNextCounter(db);
   
    // find the document 
    // either insert or update 
    await CartItemModel.create(
        {productID:new ObjectId(productID),userID:new ObjectId(userID),quantity:1} //filter
        // {
        //  $setOnInsert:{productID:new ObjectId(productID),userID:new ObjectId(userID)},
        //   $inc:{ 
           //update or insert
        //   }
        // }
        // ,
        // {upsert:true}
    )          // options
        
 
    // await collection.insertOne({productID:new ObjectId(productID),userID: new ObjectId(userID),quantity});
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Something went wrong with database ",500);
    }
    
}
async updateCart(quantity,cartID,userID){
try {
    await CartItemModel.updateOne({_id:new ObjectId(cartID),userID:new ObjectId(userID)},
 {quantity:quantity}
)
} catch (error) {
    console.log(error);
        throw new ApplicationError("Something went wrong with database ",500); 
}
}
async get(userID){
    try {
   return await CartItemModel.find({userID: new ObjectId(userID)}).populate("productID");   //cursor
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Something went wrong with database ",500);
    }
    
}
async getByProductID(productID,userID){
    try {
        const product= await CartItemModel
        .findOne({userID: new ObjectId(userID),productID:new ObjectId(productID)})
        .populate("productID"); 
        console.log(product);
        return product;
    } catch (error) {
        console.log(err);
        throw new ApplicationError("Something went wrong with database ",500);
    }
}
async delete(cartItemID,userID){
    try {
   const result=await CartItemModel.deleteOne({_id: new ObjectId(cartItemID),userID:new ObjectId(userID)});
   return result.deletedCount>0;
    } catch (err) {
        console.log(err);
        throw new ApplicationError("Something went wrong with database ",500);
    }
    
}
async getNextCounter(db){
    const resultDocument=await db.collection("counters").findOneAndUpdate(
        {_id:'cartItemId'},
        {$inc:{value:1}},
        {returnDocument:'after'}
    )
    console.log(resultDocument);
    return resultDocument.value // document value/ attribute

}

}