import express from "express";
import { protechRoute } from "../middleware/auth.middleware.js";
import { createCheckOutSession } from "../controllers/payment.controller.js";


const router = express.Router();

router.post("/create-checkout-session", protechRoute, createCheckOutSession);

export default router;