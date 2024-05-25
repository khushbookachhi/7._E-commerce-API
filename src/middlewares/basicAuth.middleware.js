import UserModel from "../features/user/user.model.js";

const basicAuthorizer=(req,res,next)=>{
    // 1. Check if authorization header is empty.
const authHeader=req.headers['authorization'];
console.log("authHeader value:-",authHeader);
if(!authHeader){
    //401 means unauthorized
    return res.status(401).send("No authorization details found!"); 
}
// 2.Extract crendentials. [Basic qwertyusdfgh3456788vdfgh]
const base64Credentials=authHeader.replace('Basic ','');
console.log("base64Credentials value:-",base64Credentials);
 //3. decode credentials
const decodedCreds=Buffer.from(base64Credentials, 'base64').toString('utf8');
console.log("decodedCreds value:-",decodedCreds); // [username:password]
const creds=decodedCreds.split(':');
const user=UserModel.getAll().find(
    u=>u.email==creds[0] && u.password==creds[1]
    );
    if(user){
        next(); 
    }else{
        return res.status(401).send("incorrect credentials!");
    }
}
export default basicAuthorizer;