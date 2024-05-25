import { ApplicationError } from "../../error-handler/applicationError.js";
import UserModel from "../user/user.model.js";
export default class ProductModel{
    constructor(name,price,imageUrl,sizes,stock,categories,userID){
    // this.id=id;
    this.name=name;
    // this.desc=desc;
    this.price=price;
    this.imageUrl=imageUrl;
    this.sizes=sizes;
    this.stock=stock;
   this.categories=categories;
   this.userID=userID;
    }
    static getAll(){
        return products;
    }
    static add(product){
        product.id=products.length+1;
        products.push(product);
        return  product;
    }
    static get(id){
        const product=products.find((i)=>i.id==id);
        return product;
    }
    
    static rateProduct(userID,productID,rating){
        // 1. Validate user and product 
       const user= UserModel.getAll().find((u)=>u.id==userID);
       if(!user){
        throw new ApplicationError('User not found', 404);
       }
       // 2. Validate products 
     const product= products.find((p)=>
        p.id==productID
    );
    if(!product){
        throw new ApplicationError('Product not found', 400);
    }
    //check if there are any ratings if not then  add ratings here
    if(!product.ratings){
        product.ratings=[];
        product.ratings.push({
            userID:userID, rating:rating,
        });
    }else{
        //check if user rating is already available
        const existingRatingIndex=product.ratings.findIndex(
            (r)=>r.userID==userID
        );
        if(existingRatingIndex>=0){
            product.ratings[existingRatingIndex]={
                userID:userID, rating:rating
            };
        }else{
            product.ratings.push({
                userID:userID, rating:rating,
            });
        }
    }
    }
}
var products=[
    new ProductModel(
        1,
        'Product 1',
        'Description for Product 1',
        19.99,
        'https://m.media-amazon.com/images/I/51-nXsSRfZL._SX328_BO1,204,203,200_.jpg',
        'Category1',
        ['XXL','M','XL'],),
    new ProductModel( 
        2,
        'Product 2',
        'Description for Product 2',
        29.99,
        'https://m.media-amazon.com/images/I/51xwGSNX-EL._SX356_BO1,204,203,200_.jpg',
        'Category2',
        ['XXL','M','XL','S'],),
    new ProductModel(
        3,
        'Product 3',
        'Description for Product 3',
        39.99,
        'https://m.media-amazon.com/images/I/31PBdo581fL._SX317_BO1,204,203,200_.jpg',
        'Category3',
        ['XXL','M','XL','S','L'],),
    ]