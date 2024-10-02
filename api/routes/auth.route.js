import express from 'express';
import { getProfile, login, logout, refreshTokenAfterExpires, signup } from '../controllers/auth.controller.js';

const router = express.Router();

//post methods
router.post("/signup",signup); 
router.post("/login",login);
router.post("/logout",logout);
router.post("/refresh-token",refreshTokenAfterExpires);
router.post("/profile",getProfile);

export default router;