//manage routes/paths to productController
//import express
import express from 'express';
import CartItemController from './cartItems.controller.js';

// get router (initialize)
const cartRouter=express.Router();
const cartItemController=new CartItemController();
cartRouter.post("/",(req,res)=>{
    cartItemController.addToCart(req,res);
});
cartRouter.get("/",(req,res,next)=>{
    cartItemController.get(req,res,next);
},);
cartRouter.put("/updateCart",(req,res)=>{
    cartItemController.updateCartItem(req,res);
},);
cartRouter.get("/getByProductID/:productID",(req,res,next)=>{
    cartItemController.getByProductID(req,res,next);
})
cartRouter.delete("/:id",(req,res)=>{
    cartItemController.delete(req,res);
},);
export default cartRouter;