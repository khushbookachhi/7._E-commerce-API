import OrderRepository from "./order.repository.js";


export default class OrderController{
    constructor(){
        this.orderRepository=new OrderRepository();
    }
    async placeOrder(req,res,next){
        try {
            const userID=req.userID;
        await this.orderRepository.placeOrder(userID);
        res.status(201).send("Order is created SuccessFully!");
        } catch (error) {
            console.log(error);
            res.status(404).send("Something went wrong");
            next();
        }
        
    }
    async getOrder(req,res,next){
        try {
            const userID=req.userID;
            const orders=await this.orderRepository.getOrder(userID);
            res.status(201).send(orders);
        } catch (error) {
            console.log(error);
            res.status(404).send("Something went wrong");
            next();
        }
    }
}