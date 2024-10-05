import express from "express";
import { protechRoute } from "../middleware/auth.middleware.js";
import { checkoutSuccess, createCheckOutSession } from "../controllers/payment.controller.js";


const router = express.Router();

router.post("/create-checkout-session", protechRoute, createCheckOutSession);
router.post("/checkout-success", protechRoute, checkoutSuccess);

export default router;