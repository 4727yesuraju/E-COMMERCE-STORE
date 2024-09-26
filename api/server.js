import express from 'express';

const app = express();


app.get('/',(req,res)=>{
    res.send("hello from server :)")
})

const PORT = 5000;


app.listen(PORT,()=>{
   console.log(`server is running at http://localhost:${PORT}`);
})