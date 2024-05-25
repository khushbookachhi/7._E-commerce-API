import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";


class UserRepository{
    constructor(){
        this.collection="users";
    }
     async signUp(newUser){
        //Get the database
        try {
            const db=getDB();
        // get the Collection
        const collection=db.collection(this.collection); 
        //insert the document
        await collection.insertOne(newUser);
        console.log(newUser);
        return newUser;
        } catch (error) {
           console.log(error);
            throw new ApplicationError("Something went wrong with database ",500);
        }
        
    }
    async findByEmail(email){
        try {
            const db=getDB();
        // get the Collection
        const collection=db.collection(this.collection); 
        //insert the document
       return await collection.findOne({email});
        
        } catch (error) {
           console.log(error);
            throw new ApplicationError("Something went wrong with database ",500);
        }
        
    }

}
export default UserRepository;