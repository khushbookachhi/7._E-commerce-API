import './env.js';
//import express
import express from 'express';
import bodyParser from 'body-parser';
import swagger from 'swagger-ui-express';
import cors from 'cors';
import mongoose from 'mongoose';
import productRouter from './src/features/product/product.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cartItems/cartItems.routes.js';
import apiDocs from './swagger.json' assert {type:'json'};
// const apiDocs=require('./swagger.json');
// import basicAuthorizer from './src/middlewares/basicAuth.middleware.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';
import loggerMiddleware from './src/middlewares/logger.middleware.js';
import { ApplicationError } from './src/error-handler/applicationError.js';
import {connectToMongoDB} from './src/config/mongodb.js';
import orderRouter from './src/features/order/order.routes.js';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import likeRouter from './src/features/like/like.routes.js';

//create server
const server=express();
const port=process.env.PORT;
//CORS policy configuration
var corsOptions = {
    origin: "*"
  }
  server.use(cors(corsOptions));
// server.use(cors());
// server.use((req,res,next)=>{
//     res.header('Access-Control-Allow-Origin','http://localhost:5500')  // * for all web clients
//     res.header('Access-Control-Allow-Headers', '*');
//     res.header('Access-Control-Allow-Methods', '*');
//     // return ok for preflight request 
//     if(req.method=="OPTIONS"){
//         return res.sendStatus(200);
//     }
//     next();
// })
server.use(bodyParser.json());
server.use(express.static('uploads'));
server.use("/api-docs",swagger.serve,swagger.setup(apiDocs));
server.use(loggerMiddleware);
server.use('/api/likes',jwtAuth,likeRouter);
server.use('/api/orders',jwtAuth,orderRouter);
//for all requests related to product, redirect to product routes,
server.use('/api/products',jwtAuth,productRouter);
//for all requests related to user, redirect to user routes,
server.use('/api/users',userRouter);
//for all requests related to cart, redirect to cart routes,
server.use('/api/cartItems',jwtAuth,cartRouter);
//default request handler
server.get('/',(req,res)=>{
    res.send("welcome to Ecommerce API");
})
//Error handler middleware
server.use((err,req,res,next)=>{
    console.log(err);
   if(err instanceof mongoose.Error.ValidationError){
    return res.status(400).send(err.message);
   }
   
    if(err instanceof ApplicationError){
        return  res.status(err.code).send(err.message);
    }else{
        console.log(err);
        //server error
        res.status(500).send('Something went wrong,please try later');
    }
    
})
// Middleware to handle 404 requests 
server.use((req,res)=>{
    res.status(404).send("API not found Please check our documententation for more at localhost:3200/api-docs"); 
})
//specific port
server.listen(port,()=>{
    console.log(`server is listening on port ${port}`);
    // connectToMongoDB();   //mongo db package
    connectUsingMongoose();
})