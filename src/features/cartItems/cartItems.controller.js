
import CartItemsRepository from "./cartitems.repository.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class CartItemController{
    constructor(){
        this.cartItemRepository=new CartItemsRepository();
    }
    
    async addToCart(req,res){
        try {
            const{productID}=req.body;
            const userID=req.userID;
           await this.cartItemRepository.add(productID,userID);
           res.status(201).send('Cart is updated');
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with CartItem controller ",500);
  
        }
    }
   async get(req,res,next){
        try {
        const userID=req.userID;
        const items=await this.cartItemRepository.get(userID);
        return res.status(200).send(items);
        }catch (error) {
            console.log(error);
            const newErr= new ApplicationError("Something went wrong with CartItem controller ",500);
            next(newErr);
        }
    }
    async getByProductID(req,res,next){
        try {
            const productID=req.params.productID;
            const userID=req.userID;
            console.log("productID ",productID);
           const product= await this.cartItemRepository.getByProductID(productID,userID);
            res.status(200).send(product);
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with CartItem controller ",500);
        }
    }
   async updateCartItem(req,res){
        const{quantity,cartID}=req.body;
        const userID=req.userID;
        console.log("quantity ",typeof quantity);
        try {
            await this.cartItemRepository.updateCart(quantity,cartID,userID);
        res.status(200).send('CartItem is Updated!'); 
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with CartItem controller ",500)
        }
      
    }
    async delete(req,res){
        const userID=req.userID;
        const cartItemID=req.params.id;
       const isDeleted= await this.cartItemRepository.delete(cartItemID,userID);
       if(!isDeleted){
        return res.status(404).send("Item not found");
       }
       return res.status(200).send("Cart Item is removed");
    }
}
