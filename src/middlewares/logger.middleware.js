import fs from "fs";
import { format } from "path";
import winston from "winston";
const fsPromise=fs.promises;

// async function log(logData){
//     try {
//         logData=`${new Date().toString()} . Log Data: ${logData}`;
//         // written a void promise
//        await fsPromise.appendFile("log.txt", logData);
//     } catch (error) {
//         console.log(error); 
//     }
// }
const logger= winston.createLogger({
    level:'info',
    format:winston.format.json(),
    defaultMeta:{service:'request-logging'},
    transports:[
        new winston.transports.File({filename:'logs.txt'})
    ]

})
const loggerMiddleware= async (req,res,next)=>{
    //log request body
    if(!req.url.includes('signin')){
        const logData=`${req.url}-${JSON.stringify(req.body)}`;
        console.log(logData);
       logger.info(logData)
    }
    
   next();
}
export default loggerMiddleware;