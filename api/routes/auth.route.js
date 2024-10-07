import * as express from "express";
import { getProfile, login, logout, refreshTokenAfterExpires, signup } from '../controllers/auth.controller.js';
import { protechRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

//post methods
router.post("/signup",signup); 
router.post("/login",login);
router.post("/logout",logout);
router.post("/refresh-token",refreshTokenAfterExpires);
router.get("/profile", protechRoute, getProfile);

export default router;