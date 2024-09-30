import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";

export const signup = async (req,res)=>{
     try {
        const {name, email, password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
           return res.status(400).json({error : "User already exists"});
        }
        const user = await User.create({name, email, password});
        
        const {accessToken, refreshToken} = generateTokens(user._id)

        await storeRefreshToken(user._id,refreshToken);
        res.status(201).json({user,message : "User created successfully"})
     } catch (error) {
        res.status(500).json({error : "while signup " + error.message})
     }
}
export const login = async (req,res)=>{
     try {
        res.send("login");
     } catch (error) {
        res.status(500).json({error : "while login " + error.messge})
     }
}
export const logout = async (req,res)=>{
     try {
        res.send("logout");
     } catch (error) {
        res.status(500).json({error : "while logout " + error.messge})
     }
}



function generateTokens(userId){
   const accessToken = jwt.sign({userId},process.env.ACCESS_TOKEN_SECRET,{
      expiresIn : "15m"
   });

   const refreshToken = jwt.sign({userId},process.env.REFRESH_TOKEN_SECRET,{
      expiresIn : "7d"
   });

   return {accessToken, refreshToken}
}

async function storeRefreshToken(userId,refreshToken){
   await redis.set(`refresh_token : ${userId}`,refreshToken,"EX",7*24*60*60); //7days in the form of seconds
}