//manage routes/paths to userController
//import express
import express from 'express';
import {UserController} from './user.controller.js';
import jwtAuth from '../../middlewares/jwt.middleware.js';

// get router (initialize)
const userRouter=express.Router();
const userController=new UserController;
//All the paths to controller methods.


userRouter.post("/signup",(req,res,next)=>{
    userController.signUpController(req,res,next);
});
userRouter.post("/signin",(req,res,next)=>{
    userController.signInController(req,res,next);
});
userRouter.get("/",jwtAuth,(req,res,next)=>{
    userController.getUser(req,res,next);
})
userRouter.put("/resetPassword",jwtAuth,(req,res,next)=>{
    userController.resetPassword(req,res,next);
});



export default userRouter;