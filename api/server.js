import cookieParser from 'cookie-parser'
import express from 'express';
import {config} from 'dotenv';
config();

//router
import authRoutes from './routes/auth.route.js';
import productRoutes from './routes/product.route.js';
import cartRoutes from './routes/cart.route.js';
import couponRoutes from './routes/coupon.route.js';
import paymentRoutes from './routes/payment.route.js';
import analyticsRoutes from './routes/analytics.route.js';

import { connectToDB } from './lib/db.js';



const app = express();
const PORT = process.env.PORT || 8080; 

app.use(express.json()); //allows you to parse body of the request
app.use(cookieParser())

//test
// app.get('/',(req,res)=>{
//     res.send("hello from server :)")
// })

app.use("/api/auth",authRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
app.use("/api/coupon",couponRoutes);
app.use("/api/payment",paymentRoutes);
app.use("/api/analytics",analyticsRoutes);


app.listen(PORT,()=>{
   console.log(`server is running at http://localhost:${PORT}`);
   connectToDB()
})