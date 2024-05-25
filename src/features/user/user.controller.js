import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "./user.model.js";
import jwt from "jsonwebtoken";
import UserRepository from "./user.repository.js";
import bcrypt from 'bcrypt'; 
export class UserController{
  constructor(){
    this.userRepository=new UserRepository();
  }
  async resetPassword(req,res){  // reset password then confirm password is your task to do
    const {newPassword,confirmPassword}=req.body;
    ///hash password
    try {
      if(newPassword===confirmPassword){
        const hashPassword=await bcrypt.hash(newPassword,12);
        const userID=req.userID;
        try {
          await this.userRepository.resetPassword(userID,hashPassword);
          res.status(200).send("Password is updated");
          } catch (error) {
            console.log(error);
            const applicationError=new ApplicationError("Something went wrong with resetPassword controller ",500);
           
            next(applicationError);
          }
          
      
      }
    } catch (error) {
      res.status(400).send("password is not matched !");
    }
   
    
    
  }
   async signUpController(req,res,next){
    const{name,email,password,type}=req.body;
    try {
      
   ///hash password
   console.log(req.body);
   const hashPassword=await bcrypt.hash(password,12); 
      const user=new UserModel(name,email,hashPassword,type);
     
      await this.userRepository.signUp(user);
      res.status(201).send(user);
    } catch (error) {
      console.log(error);
      const applicationError= new ApplicationError("Something went wrong with signup controller ",500);
     next(applicationError);
    }
   
    }

   async signInController(req,res,next){
console.log(req.body.email,req.body.password);
try {
  const user=await this.userRepository.findByEmail(req.body.email);
  console.log(user);
  if(!user){
    return res.status(400).send("Incorrect credentials");
  }else{
    //compare password with hashed password
    const result=bcrypt.compare(req.body.password,user.password);
    console.log("result is:-",result);
    if(result){
     // 1.create token 
    const token=jwt.sign({
      userID:user._id,
      email:user.email,
  },
  process.env.JWT_Secret,
  {
      expiresIn:'4h',
  }
  );
  // 2. send token 
  return res.status(200).send(token);
    }else{
      return res.status(400).send("Incorrect credentials");
  }
  }
}catch (error){
  console.log(error);
  const applicationError=  new ApplicationError("Something went wrong with signIn controller ",500);
  next(applicationError);
    }
  }
  async getUser(req,res,next){
    const userID=req.userID;
    try {
      const userData=await this.userRepository.getUser(userID);
      return res.status(200).send(userData);
    } catch (error) {
      console.log(error);
  const applicationError=  new ApplicationError("Something went wrong while getting userData",500);
  next(applicationError);
    }
   
    
  }
}