import jwt from 'jsonwebtoken';

const jwtAuth=(req,res,next)=>{
    // 1.Read the token 

  const tokenHeader=req.headers['authorization'];

    // 2. if no token return the error 
if(!tokenHeader){
    return res.status(401).send('Unauthorized');
}
const [bearer,token]=tokenHeader.split(' ');
if (bearer !== 'Bearer' || !token) {
    return res.status(401).send('Unauthorized');
}

    // 3.check if token is valid 
try {
const payload=jwt.verify(token,'elYb3Vzc5PCGe9FXRaNR9qoHnQ567KSN');
req.userID=payload.userID;
console.log("payload is:-",payload);
console.log("UserID is:-",req.userID);
} catch (err) {
     // 4.return error 
    return res.status(401).send('Unauthorized or something went wrong in token');
}
    // 5.call next middleware 

   next();
}
export default jwtAuth;