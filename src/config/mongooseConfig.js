import mongoose from "mongoose";
import { categorySchema } from "../features/product/category.schema.js";
const url=process.env.DB_URL;

export const connectUsingMongoose=async()=>{
    try {
        await mongoose.connect(url
        //    {
        //     useNewUrlParser:true,
        //     useUnifiedTopology:true
        //    } 
        );  
        console.log("Mongodb is connected using mongoose");
        addCategories();
    } catch (error) {
        console.log("mongoose connection error!");
        console.log(error);
    }
    
}
//default values added
async function addCategories(){
    const CategoryModel=mongoose.model("Category",categorySchema);
    const categories=CategoryModel.find();
    if(!categories|| (await categories).length==0){
        await CategoryModel.insertMany([{name:'Books'},{name:'Electronics'},{name:'Clothing'},
    {name:'jwellery'},{name:'grocery'},{name:'Women'},{name:'Man'},{name:'toys'},{name:'makeup'},
{name:'cleaning'}])
    }
    console.log("Categories added");
}