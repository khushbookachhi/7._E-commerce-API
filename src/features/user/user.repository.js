import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { userSchema } from "./user.schema.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
//creating model from schema
const UserModel=mongoose.model('User', userSchema);

export default class UserRepository{
    async resetPassword(userID,hashedPassword){
try {
    let user=await UserModel.findById(userID);
    if(user){
        user.password=hashedPassword;
        user.save();   //update and save 
    }else{
        throw new Error("No such user found");
    }
   

} catch (error) {
    console.log(error);
  throw new ApplicationError("Something went wrong with database",500);
   
}
    }
    async signUp(user){
        try {
          //create instance of model.
        const newUser=new UserModel(user);
        await newUser.save();  
        return newUser;
        } catch (error) {
            console.log(error);
            if(error instanceof mongoose.Error.ValidationError){
               console.log("validate user ",error);
            }else{
                throw new ApplicationError("Something went wrong with database",500);
               
            }
           
        }
        
    }
    async signIn(email,password){
        try {
        return await UserModel.findOne({email,password});
          } catch (error) {
              console.log(error);
              throw new ApplicationError("Something went wrong with database",500);
             
          }
    }
    async findByEmail(email){
        try {
        
       return await UserModel.findOne({email});
        
        } catch (error) {
           console.log(error);
         throw new ApplicationError("Something went wrong with database",500);
        
        }
        
    }
    async getUser(userID){
        try {
            const user =await UserModel.findOne({_id:new ObjectId(userID)}); 
            console.log(user);
            return user;
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database",500); 
        }
    }

}