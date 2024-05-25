//manage routes/paths to productController
//import express
import express from 'express';
import ProductController from './product.controller.js';
import upload from '../../middlewares/file-upload.middleware.js';
// get router (initialize)
const productRouter=express.Router();
const productController=new ProductController;
//All the paths to controller methods.
//localhost/api/products
productRouter.post('/rate',(req,res,next)=>{   //*
    productController.rateProduct(req,res,next);
});
//get reviews
productRouter.get('/ratings/:id',(req,res,next)=>{  //*
    productController.getRatings(req,res,next);
});
productRouter.get("/filter",(req,res)=>{      //*
    productController.filterProducts(req,res);
});

productRouter.get("/",(req,res)=>{      //*
    productController.getAllProducts(req,res);
});
productRouter.get("/getProductsByUserID",(req,res,next)=>{
    productController.getProductsByUserID(req,res,next);
})
productRouter.post("/",              //*
upload.single('imageUrl'),(req,res)=>{
    productController.addproduct(req,res);
});
productRouter.put("/updateProduct/:id",upload.single('imageUrl'),(req,res,next)=>{
    productController.updateProduct(req,res,next);
})
productRouter.delete("/deleteProduct/:id",(req,res,next)=>{
    productController.deleteProduct(req,res,next);
})
productRouter.get("/getAllCategories",(req,res,next)=>{
    productController.getAllCategories(req,res,next);
})
productRouter.get("/averagePrice",(req,res,next)=>{  //*
    productController.averagePrice(req,res,next);
});
productRouter.get("/averageRating",(req,res,next)=>{  //*
    productController.averageRating(req,res,next);
})
// productRouter.get("/countRating/:id",(req,res,next)=>{
//     productController.countRatings(req,res,next); 
// })
productRouter.get("/:id",(req,res)=>{         //*
    productController.getOneProduct(req,res);
});

//localhost:4100/api/products/filter?minPrice=10&maxPrice=20&category=Category1

export default productRouter;