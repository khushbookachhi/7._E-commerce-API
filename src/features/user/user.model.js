// import { Collection } from "mongodb";
import { getDB } from "../../config/mongodb.js";
import { ApplicationError } from "../../error-handler/applicationError.js";

export default class UserModel{
    constructor(name,email,password,type){
        this.name=name;
        this.email=email;
        this.password=password;
        this.type=type;
        
    }
    
    static getAll(){
        return users;
    }
}
let users=[{
    id:1,
    name:"Seller User",
    email:"seller@ecom.com",
    password:"Password1",
    type:"seller",
},
{
    id:2,
    name:"Customer User",
    email:"customer@ecom.com",
    password:"Password1",
    type:"customer",
},
]