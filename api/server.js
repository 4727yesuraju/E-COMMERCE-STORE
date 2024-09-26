import express from 'express';
import {config} from 'dotenv';

//router
import authRoutes from './routes/auth.route.js';
import { connectToDB } from './lib/db.js';
config();



const app = express();
const PORT = process.env.PORT || 8080;  

//test
// app.get('/',(req,res)=>{
//     res.send("hello from server :)")
// })

app.use("/api/auth",authRoutes);


app.listen(PORT,()=>{
   console.log(`server is running at http://localhost:${PORT}`);
   connectToDB()
})