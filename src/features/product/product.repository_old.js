
import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";
const ProductModel=mongoose.model("Product",productSchema);
const ReviewModel=mongoose.model("Review",reviewSchema);

class ProductRepository{
    constructor(){
        this.collection="products";
    }
async add(newProduct){
try {
    //get the db
    const db= getDB();
    const collection=db.collection(this.collection);
    await collection.insertOne(newProduct);
    return newProduct;
} catch (error) {
    console.log(error);
    throw new ApplicationError("Something went wrong with database ",500);
}
}
async getAll(){
    try{
        const db = getDB();
        const collection = db.collection(this.collection);
        const products = await collection.find().toArray();
        console.log("this is product",products);
        return products;
    } catch(err){
        console.log(err);
        throw new ApplicationError("Something went wrong with database", 500);
    }
}

async get(id){
    try {
        const db= getDB();
        const collection=db.collection(this.collection);
       const product= await collection.findOne({_id:new ObjectId(id)});
       return product;
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with database ",500);
    }
}
// Product should have min price specified and category
async filter(minPrice,categories){
    try {
         //get the db
    const db= getDB();
    const collection=db.collection(this.collection);
    let filterExpression={};
    if(minPrice){
        filterExpression.price={$gte: parseFloat(minPrice)};
    }
    //['cat1','cat2']
    // console.log("categories are:- ",categories);
    categories=JSON.parse(categories.replace(/'/g,'"'));
    console.log("categories are:- ",categories);
    if(categories){
        filterExpression={$or:[{category:{$in:categories}},filterExpression]}
        // filterExpression.category=category;
    }
    return collection.find(filterExpression).project({name:1,price:1,_id:0,ratings:{$slice:1}}).toArray();
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with database ",500);
    }
}
// this method can rise race condition 

// async rate(userID,productID,rating){
//     try {
//               //get the db
//     const db= getDB();
//     const collection=db.collection(this.collection);
//     // 1.Find the product 
//     const product=await collection(this.collection);
//     // 1.Find the rating 
//     const userRating=product?.ratings?.find(r=>r.userID==userID);
//     if (userRating) {
//         // 3. update the rating 
//         await collection.updateOne({
//          _id:new ObjectId(productID),"ratings.userID":new ObjectId(userID)
//         },{
//          $set:{
//            "ratings.$.rating":rating        //updating first finding rating
//           }
//         })
//     } else {
//         await collection.updateOne({
//             _id:new ObjectId(productID)
//         },{
//             $push:{ratings:{userID: new ObjectId(userID), rating}}
//         })
//     }   
//     } catch (error) {
//         console.log(error);
//         throw new ApplicationError("Something went wrong with database ",500);
//     }
// }

async rate(userID,productID,rating){
    try {
    //           //get the db
    // const db= getDB();
    // const collection=db.collection(this.collection);
    // // 1. Removing existing entry 
    // await collection.updateOne({
    //     _id:new ObjectId(productID)
    // },{
    //     $pull:{ratings:{userID:new ObjectId(userID)}}
    // })
    // // 2. Add new entry 
    //     await collection.updateOne({
    //         _id:new ObjectId(productID)
    //     },{
    //         $push:{ratings:{userID: new ObjectId(userID), rating}}
    //     })
    
    //1. Check if product exists
    const productToUpdate=await ProductModel.findById(productID);
    if(!productToUpdate){
        throw new Error("product not found");
    }
    //Find the existing review
    const userReview=await ReviewModel.findOne({
        product:new ObjectId(productID),user: new ObjectId(userID)
    })
    if(userReview){
        userReview.rating=rating;
        await userReview.save();
    }else{
        const newReview=new ReviewModel({
            product:new ObjectId(productID),
            user: new ObjectId(userID),
            rating:rating
        })
        newReview.save();
    }
       
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with database ",500);
    }
}
async averageProductPricePerCategory(){
    try {
       const db=getDB();
      return await db.collection(this.collection)
       .aggregate([
        {
            // Stage:1 Get average price per category 
            $group:{
                _id:"$category",
                averagePrice:{$avg:"$price"}
            }
        }
       ]).toArray();
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with database ",500);
    }
}
}
export default ProductRepository;