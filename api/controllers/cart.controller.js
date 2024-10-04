import Product from "../models/product.model.js";

export const addToCart = async (req,res)=>{
    try {
        const {productId} = req.body;
        const user = req.user;

        const existingItem = user.cartItems.find(item=>item.id==productId)
        if(existingItem){
            existingItem.quantity += 1;
        }else{
            user.cartItems.push(productId)
        }

        await user.save();
        res.status(201).json({cartItems : user.cartItems,message : "add to cart"})
    } catch (error) {
        res.status(500).json({error : `while adding to cart : ${error.message}`})
    }
}


export const getCartProducts = async (req,res)=>{
    try {
        const products = await Product.find({_id : { $in : req.user.cartItems}});

        //add quantity for each product
        const cartItems = products.map(product=>{
            const item = req.user.cartItems.find(cartItem=>cartItem.id===product.id);
            return ({...product.toJSON(), quantity : item.quantity});
        })
        res.statu(200).json({cartItems,message : "cartItems fetched successful"});
    } catch (error) {
        res.status(500).json({error : `while getting cart products : ${error.message}`})
    }
}


export const removeALlFromCart = async (req,res)=>{
    try {
        const {productId} = req.body;
        const user = req.user;
        if(!productId) user.cartItems = [];
        else user.cartItems = user.cartItems.filter(item=>item.id!==productId);
        await user.save();
        res.status(201).json({cartItems : user.cartItems,message : "cart deleted successful"})
    } catch (error) {
        res.status(500).json({error : `while removing all from cart : ${error.message}`})
    }
}


export const updateQuantity = async (req,res)=>{
    try {
        const {id : productId} = req.params;
        const {quantity} = req.body;
        const user = req.user;
        const existingItem = user.cartItems.find(item=>item.id===productId);

        if(existingItem){
            if(quantity === 0){
                user.cartItems = user.cartItems.filter(item=>item.id!==productId);
                await user.save();
                return res.status(200).json({cartItems : user.cartItems,message : "quantity is updated"})
            }

            existingItem.quantity = quantity;
            await user.save();
            res.status(200).json({cartItems : user.cartItems,message : "quantity is updated"});
        }else{
            res.status(404).json({error : 'product not found'});
        }
    } catch (error) {
        res.status(500).json({error : `while updating cart quantity : ${error.message}`})
    }
}