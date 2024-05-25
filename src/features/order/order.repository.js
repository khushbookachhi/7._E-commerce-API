import { ObjectId } from "mongodb";
import { getClient, getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { orderSchema } from "./order.schema.js";
import mongoose from "mongoose";
import { productSchema } from "../product/product.schema.js";
import { cartSchema } from "../cartItems/cartItems.schema.js";
// import OrderModel from "./order.models.js";
const OrderModel=mongoose.model("Order",orderSchema);
const ProductModel=mongoose.model("Product",productSchema);
const CartItemModel=mongoose.model("CartItems",cartSchema);
export default class OrderRepository{
    constructor(){
        this.collection="orders";
    }
    async getOrder(userID){
        try {
            const orders=await OrderModel.find({userID: new ObjectId(userID)});
            return orders;
        } catch (error) {
            console.log(error);
            throw new ApplicationError('Something went wrong with getOrder',404); 
        }
    }
    async placeOrder(userID){
       
        const session=await mongoose.startSession() // session is for all process occuring in one go
        try {
            session.startTransaction();
             // 1. Get cart items and calculat totalAmount 
      const items= await this.getTotalAmount(userID,session);
      const mappedItems = items.map(item => ({
        productID: item.productID,
        title: item.productInfo.name,
        price: item.productInfo.price,
        quantity: item.quantity,
        totalPrice: item.totalAmount // Calculate totalPrice
    }));

       const finalAmount= items.reduce((acc,item)=>acc+item.totalAmount,0);
       //2.create an order record 
       const newOrder=new OrderModel({ _id: new ObjectId(),userID:new ObjectId(userID),items:mappedItems,totalAmount:finalAmount,orderDate:new Date()},{session});
      await newOrder.save();

       //3.Reduce the stock
       for(let item of items){
        await ProductModel.updateOne(
            {_id: item.productID},
            {$inc:{stock:-item.quantity}} ,{session}
        )
       }
    //    throw new Error("Something is wrong in placeorder");
       //4.clear the cart items
       await CartItemModel.deleteMany({
         userID:new ObjectId(userID)
       },{session});

      await session.commitTransaction();
       session.endSession();
       return;
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error);
            throw new ApplicationError('Something went wrong with placeOrder',404);

        }
       
    }
    async getTotalAmount(userID,session){
        
     const items=await CartItemModel.aggregate([
            //1.Get cartItems for user
           { $match:{userID:new ObjectId(userID)}},
           //2.Get the products from products Collection
           {
            $lookup:{       ///left outer join 
                from:"products",
                localField:"productID",
                foreignField:"_id",
                as:"productInfo"
            }
           },
        //    3. Unwind the productInfo 
        {
            $unwind:"$productInfo"
        },
        // 4.Calculate total amount for each CartItems
       { $addFields:{
            "totalAmount":{
                $multiply:["$productInfo.price","$quantity"]
            }
           
        }}
        ],{session});
        console.log(items);
        return items;
      
    }
}