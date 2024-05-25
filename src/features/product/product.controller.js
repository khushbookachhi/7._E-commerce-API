import { ApplicationError } from "../../error-handler/applicationError.js";
import ProductModel from "./product.model.js";
import ProductRepository from "./product.repository.js";
// import ProductRepository from "./product.repository.js";
 
export default class ProductController{
    constructor(){
        this.productRepository=new ProductRepository();
    }
    async getAllCategories(req,res,next){
        try {
            const categories=await this.productRepository.getAllCategories();
            res.status(200).send(categories); 
        } catch (error) {
            console.log(error);
            const newErr= new ApplicationError("Something went wrong with product controller ",500);
            next(newErr);
        }
    }
   async getAllProducts(req,res){
    try {
        const products=await this.productRepository.getAll();
        res.status(200).send(products);  
    } catch (error) {
        console.log(error);
      throw new ApplicationError("Something went wrong with product controller ",500);
    }
       
    }
    async getProductsByUserID(req,res,next){
        const userID=req.userID;
        console.log("get UserID ",userID);
        try {
            const products=await this.productRepository.getProductsByUserID(userID);
            res.status(200).send(products);  
        } catch (error) {
            console.log(error);
      throw new ApplicationError("Something went wrong with product controller ",500); 
        }
    }
    async addproduct(req,res){
        // name,desc,price,imageUrl,category,sizes
        const userID=req.userID;
        try {
            console.log("add product is called");
            console.log(req.body);
            const {name,price,sizes,categories,stock}=req.body;
            const newProduct=new ProductModel(
             name,
             parseFloat(price),
             req.file.filename,
             sizes.split(','),
             parseInt(stock),
             categories.split(','),
             userID
             )
            console.log(newProduct);
           const createdProduct=await this.productRepository.add(newProduct);
             console.log("this is post request:-",createdProduct);
             // 201 resource has been created

             res.status(201).send(createdProduct);
        } catch (error) {
            console.log(error);
      throw new ApplicationError("Something went wrong with product controller ",500);
        }
      
    }
    async updateProduct(req,res,next){
        try {
            const userID=req.userID;
            const productID=req.params.id;
            const updateBody={...req.body};
            console.log(updateBody);
                    // Remove any null or undefined fields from updateBody
             for (const key in updateBody) {
                 if (updateBody[key] === null || updateBody[key] === undefined) {
                    console.log(key," ",updateBody[key]);
                    delete updateBody[key];
                }
            }
        if(updateBody.sizes){
            updateBody.sizes=updateBody.sizes.split(',');
        }
        if(updateBody.categories){
            updateBody.categories=updateBody.categories.split(',');
        }
      
            if(req.file && req.file.filename){
                console.log("imageUrl executing");
                updateBody.imageUrl=req.file.filename;
            }
            console.log(updateBody);

            await this.productRepository.update(userID,productID,updateBody);
            res.status(200).send("Product Updated Successfully!")
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with product controller ",500);
        }
    }
    async deleteProduct(req,res,next){
        try {
            const userID=req.userID;
            const productID=req.params.id;
            await this.productRepository.delete(userID,productID);
            res.status(200).send("Product deleted Successfully!")
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with product controller ",500); 
        }
    }
    async rateProduct(req,res,next){
        try {
        console.log(req.body);
        const userID=req.userID;
        const productID=req.body.productID;
        const rating=req.body.rating;
        
           await this.productRepository.rate(userID,productID,rating);
        return res.status(200).send("rating has been added!");
         } catch (error) {
            console.log(error);
            next(error);
        }
        
    }
    async getRatings(req,res){
          try {
            const id=req.params.id;
            const productRatings=await this.productRepository.getRatings(id);
            if(!productRatings){
                console.log("is it consoling out!");
               return res.status(404).send("Product Ratings not found");
            }else{
                return res.status(200).send(productRatings);
            } 
          } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with product controller ",500);
          }
    }
    async getOneProduct(req,res){
        try {
            const id=req.params.id;
            const product=await this.productRepository.get(id);
            console.log("getOneProduct is calling!",product);
            if(!product){
                console.log("is it consoling out!");
               return res.status(404).send("Product not found");
            }else{
                return res.status(200).send(product);
            } 
        } catch (error) {
            console.log(error);
            throw new ApplicationError("Something went wrong with product controller ",500);
        }
        
       
    }
async filterProducts(req,res){
    // query params like ?sndnd&dsdndk&
    try {
        const maxPrice=req.query.maxPrice;
        // const maxPrice=req.query.maxPrice;
        const categories=req.query.categories;
        console.log("filterProducts");
        console.log(maxPrice," ",typeof categories);
        const result=await this.productRepository.filter(
            maxPrice,categories
        );
        res.status(200).send(result); 
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with product controller ",500);
    }
    
}
async averagePrice(req,res,next){
    try {
      const result=await this.productRepository.averageProductPricePerCategory();
      res.status(200).send(result); 
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with product controller ",500);
        next();
    }
}
async averageRating(req,res,next){
    try {
      const result=await this.productRepository.averageRating();
      res.status(200).send(result); 
    } catch (error) {
        console.log(error);
        throw new ApplicationError("Something went wrong with product controller ",500);
        next();
    }
}
// async countRatings(req,res,next){
//     try {
//         const 
//     } catch (error) {
//         console.log(error);
//         throw new ApplicationError("Something went wrong with product controller ",500);
//         next();
//     }
// }
}

