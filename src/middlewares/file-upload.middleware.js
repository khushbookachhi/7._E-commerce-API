import multer  from "multer";
// configure with filename and storage 
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
   cb(null,'./uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString().replace(/:/g, '_')+file.originalname);
    },
});
const upload=multer({
    storage:storage
});

export default upload;