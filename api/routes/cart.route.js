import express from 'express';
import { protechRoute } from '../middleware/auth.middleware.js';
import { addToCart, getCartProducts, removeALlFromCart, updateQuantity } from '../controllers/cart.controller.js';

const router = express.Router();

//post methods
router.get("/",protechRoute,getCartProducts);
router.post("/",protechRoute,addToCart);
router.delete("/:id",protechRoute,removeALlFromCart);
router.put("/:id",protechRoute,updateQuantity);

export default router;