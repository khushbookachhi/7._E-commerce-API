import { ApplicationError } from "../../error-handler/applicationError.js";
import { LikeRepository } from "./like.repository.js";



export class LikeController{
    constructor(){
        this.LikeRepository=new LikeRepository();
    }
    async getLikes(req,res,next){
      try {
        const {id,type}=req.query;
        const likes=await this.LikeRepository.getLikes(type,id);
        res.status(200).send(likes);
      } catch (error) {
        console.log(error);
        throw new ApplicationError("Something with wrong with Controller",500); 
        // next();
      }
      // res.status(201).send("Product or Category is liked!!");
    }
    async likeItem(req,res){
      try {
        const {id,type}=req.body;
        if(type!='Product' && type!='Category'){
            return res.status(400).send("Invalid");
        }
        if(type=='Product'){
           await this.LikeRepository.likeProduct(req.userID,id);
        }else{
          await this.LikeRepository.likeCategory(req.userID,id);
        }
        }catch (error) {
        console.log(error);
        throw new ApplicationError("Something with wrong with Controller",500);  
      }
      res.status(201).send("like is toggled successfully!!");
    }
}