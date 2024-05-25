

//productID,userID,quantity
export default class CartItemModel{
    constructor(productID,userID,quantity,id){
        this.productID=productID;
        this.userID=userID;
        this.quantity=quantity;
        this.id=id;
    }
    static add(productID,userID,quantity){

        const cartItem=new CartItemModel(productID,userID,quantity,cartItems.length+1);
        cartItems.push(cartItem);
        return cartItem;
    }
    static get(userID){
        return cartItems.filter(
            (i)=>i.userID==userID
        );
    }
    static update(productID,userID,quantity,cartID){
        const cartItem= CartItemModel.get(userID).findIndex((c)=>
        c.id==cartID);
        if(cartItem>0){
           cartItems[cartItem]=new CartItemModel(productID,userID,quantity,cartID-1);
        }
    }
    static delete(cartItemID,userID){
        const cartItemIndex=cartItems.findIndex(
            (i)=>i.id==cartItemID && i.userID==userID
        );
        if(cartItemIndex==-1){
            return 'Item not found';
        }else{
            cartItems.splice(cartItemIndex,1);
        }
    }
}
var cartItems=[
    new CartItemModel(1,2,7,1),
    new CartItemModel(1,1,10,2),
];