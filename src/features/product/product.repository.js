import { ObjectId } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";
import { categorySchema } from "./category.schema.js";
import { productSchema } from "./product.schema.js";
import { reviewSchema } from "./review.schema.js";
import mongoose from "mongoose";
import UserModel from "../user/user.model.js";
const ProductModel=mongoose.model("Product",productSchema);
const ReviewModel=mongoose.model("Review",reviewSchema);
const CategoryModel=mongoose.model("Category",categorySchema);

class ProductRepository{
    constructor(){
        this.collection="products";
    }
    async add(productData){
        try {
        //    1. Adding product 
        // productData.categories=productData.categories.split(',');
        console.log(productData);
        const newProduct=new ProductModel(productData);
        const saveProduct=await newProduct.save();
        // 2. update categories 
        await CategoryModel.updateMany(
            {_id:{$in: productData.categories}},
            {$push:{products: new ObjectId(saveProduct._id)}}
        )
        return saveProduct;
          
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with database ",500);
        }
        }
        async update(userID,productID,updateBody){
            try {
                await ProductModel.updateOne(
                    {userID,_id:productID},
                    {$set:updateBody},
                    {runValidators:true}
                )
            } catch (error) {
                console.log(error);
            throw new ApplicationError("Something went wrong with database ",500);
            }
        }
        async delete(userID,productID){
            try {
                await ProductModel.deleteOne(
                    {userID,_id:productID}
                )
            } catch (error) {
                console.log(error);
                throw new ApplicationError("Something went wrong with database ",500);  
            }
        }
        async getAllCategories(){
            try {
                const categories=await CategoryModel.find().select('_id name');
                return categories;
            } catch (error) {
                console.log(error);
                throw new ApplicationError("Something went wrong with database", 500); 
            }
        }
        async getAll(){
            try{
                const products=await ProductModel.aggregate([
                   {
                    $addFields:{
                        averageRating:{
                            $ifNull:[{$avg:"$reviews.rating"},0]
                        },
                        countRatings:{
                            $ifNull:[{$size:"$reviews"},0]
                        }
                    }
                   },
                    {
                        $group:{
                            _id:"$_id",
                            userID:{ $first:"$userID"},
                            name:{ $first: "$name" },
                            price: { $first: "$price" },
                            imageUrl: { $first: "$imageUrl" }, 
                            sizes: { $first: "$sizes" },
                            averageRating: { $first: "$averageRating" },
                            countRatings: { $first: "$countRatings" } ,
                            reviews:{$first:"$reviews"}
                        }
                    }
                   
                ]);
                await ProductModel.populate(products, {
                    path: 'reviews.user',
                    select: 'name' // Specify the fields you want to populate
                });
                return products;
            } catch(err){
                console.log(err);
                throw new ApplicationError("Something went wrong with database", 500);
            }
        }
        async getProductsByUserID(userID){
            console.log("in repository",userID);
         try {
            const products=await ProductModel.aggregate([
                {$match:{userID:new ObjectId(userID) }},
               {
                $addFields:{
                    averageRating:{
                        $ifNull:[{$avg:"$reviews.rating"},0]
                    },
                    countRatings:{
                        $ifNull:[{$size:"$reviews"},0]
                    }
                }
               },
                {
                    $group:{
                        _id:"$_id",
                        userID:{ $first:"$userID"},
                        name:{ $first: "$name" },
                        price: { $first: "$price" },
                        imageUrl: { $first: "$imageUrl" }, 
                        sizes: { $first: "$sizes" },
                        averageRating: { $first: "$averageRating" },
                        countRatings: { $first: "$countRatings" } ,
                        reviews:{$first:"$reviews"},
                        categories:{$first:"$categories"},
                        stock:{$first:"$stock"}
                    }
                }
            ]);
            return products;
         } catch (error) {
            console.log(err);
                throw new ApplicationError("Something went wrong with database", 500);
         }
        }
        async get(id){
            try {
               const product= await ProductModel.findOne({_id: new mongoose.Types.ObjectId(id)});
               return product;
            } catch (error) {
                console.log(error);
                throw new ApplicationError("Something went wrong with database ",500);
            }
        }
        // Product should have min price specified and category
        async filter(maxPrice,categories){
            try {
            let filterExpression={};
            if(maxPrice){
                filterExpression.price={$lte: parseFloat(maxPrice)};
            }
            //['cat1','cat2']
            // console.log("categories are:- ",categories);
            if(categories){
                categories=categories.split(',');
                const categoriesIds=categories.map(id=>new mongoose.Types.ObjectId(id));
                console.log("categories are:- ",categoriesIds);
                if(categoriesIds){
                    filterExpression={$and:[filterExpression,{categories:{$in:categoriesIds}}]}
                }
            }
           
    
            return ProductModel.find(filterExpression)
            // .select('-categories')
          
            } catch (error) {
                console.log(error);
                throw new ApplicationError("Something went wrong with database ",500);
            }
        }
       async getRatings(productID){
        try {
            const productRatings=await ProductModel.findOne({_id: productID}).select('reviews')
            .populate({
                path: 'reviews.user',
                select: 'name' // Specify the fields you want to populate
            });
          return productRatings;
        } catch (error) {
            console.log(error);
                throw new ApplicationError("Something went wrong with database ",500);
        }
       }
        async rate(userID,productID,rating){
            try {
            //1. Check if product exists
            const productToUpdate=await ProductModel.findById(productID);
            console.log("productToUpdate",productToUpdate)
            if(!productToUpdate){
                throw new Error("product not found");
            }
            //Find the existing review
            const reviewToUpdate=await ProductModel.findOne({_id: productID,'reviews.user':new ObjectId(userID)});
        console.log("new UserReview is ",reviewToUpdate);
            if(reviewToUpdate){
               const index= productToUpdate.reviews.findIndex(review=>review.user.equals(new ObjectId(userID)))
               if(index!= -1){
                productToUpdate.reviews[index].rating=rating;
               }
            }else{
                productToUpdate.reviews.push({
                    user: new ObjectId(userID),
                    rating:rating
            })
            }
            productToUpdate.save();
            console.log("New review saved successfully!");
            } catch (error) {
                console.log(error);
                throw new ApplicationError("Something went wrong with database ",500);
            }
        }
        async averageProductPricePerCategory(){
            try {
             const result=await CategoryModel.aggregate([
                {
                 $lookup:{
                    from:'products',
                    localField:'products',
                    foreignField:'_id',
                    as:'product'
                 }
                
                },
                {$unwind:'$product'},
                {
                 $group:{
                    _id:'$name',
                    averagePrice:{$avg:'$product.price'}
                 }
                },
                {
                    $project:{
                        _id:1,
                        averagePrice:{$toInt:'$averagePrice'}
                    }
                }

             ]);
             console.log("avgPricce Result",result);
             return result;
            } catch (error) {
                console.log(error);
                throw new ApplicationError("Something went wrong with database ",500);
            }
        }
        async averageRating(){
            try {
                const result=await ProductModel.aggregate([
                    {
                        $unwind:"$reviews"
                    },           
                    {
                     $group:{
                        _id:'$name',
                        averageRating:{$avg:'$reviews.rating'}
                     }
                    }
                 ]);
                 return result;
            } catch (error) {
                console.log(error);
                throw new ApplicationError("Something went wrong with database ",500);
            }
        }
        }
        export default ProductRepository;
