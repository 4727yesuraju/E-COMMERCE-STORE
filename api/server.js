import express from 'express';
import {config} from 'dotenv';
config();

const app = express();

//test
// app.get('/',(req,res)=>{
//     res.send("hello from server :)")
// })

const PORT = process.env.PORT || 8080;


app.listen(PORT,()=>{
   console.log(`server is running at http://localhost:${PORT}`);
})