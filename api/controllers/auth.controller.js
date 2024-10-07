import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt from 'jsonwebtoken';

export const signup = async (req,res)=>{
     try {
        const {name, email, password} = req.body;
        const userExists = await User.findOne({email});
        if(userExists){
           return res.status(400).json({error : "User already exists"});
        }
        const user = await User.create({name, email, password});
        
        const {accessToken, refreshToken} = generateTokens(user._id);

        await storeRefreshToken(user._id,refreshToken);

        setCookies(res,accessToken,refreshToken);

        res.status(201).json({user : {
         _id : user._id,
         name : user.name,
         email : user.email,
         role : user.role
        },message : "User created successfully"})
     } catch (error) {
        res.status(500).json({error : "while signup " + error.message})
     }
}

export const login = async (req,res)=>{
     try {
        const {email,password} = req.body;

        const user = await User.findOne({email});

        if(user && (await user.comparePassword(password))){

         const {accessToken, refreshToken} = generateTokens(user._id);

         await storeRefreshToken(user._id,refreshToken);

         setCookies(res,accessToken,refreshToken);

         return res.status(200).json({user : {
            _id : user._id,
            name : user.name,
            email : user.email,
            role : user.role
         },message : "User Login successfully"})
         
        }else{
          return res.status(401).json({error : 'Invalid credentials '});
        }
     } catch (error) {
        res.status(500).json({error : "while login " + error.message})
     }
}

export const logout = async (req,res)=>{
     try {
        const refreshToken = req.cookies.refreshToken;
        if(refreshToken){
           const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);
           await redis.del(`refresh_token : ${decoded.userId}` )
        }

        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({message : "Logged out successfully"})
     } catch (error) {
        res.status(500).json({error : "while logout " + error.message})
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

async function setCookies(res,accessToken,refreshToken){
    res.cookie('accessToken',accessToken,{
      httpOnly : true, //prevent XSS attacks, XSS - cross site scripting attacks (injecting malicious code)
      secure : process.env.ENV === "production",
      sameSite : "strict", //prevent CSRF attack, cross-site request forgery attack (perform unwanted action - giving permissions)
      maxAge : 15 * 60 * 1000  //15 min
    });

    res.cookie('refreshToken',refreshToken,{
      httpOnly : true,
      sameSite : "strict",
      secure : process.env.ENV === 'production',
      maxAge : 7 * 24 * 60 * 60 * 1000  //7 days
    })
}


export async function refreshTokenAfterExpires(req,res){
     try {
         const refreshToken = req.cookies.refreshToken;

         if(!refreshToken){
            return res.status(401).json( {error : "No refresh token provided"})
         }

         const decoded = jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET);

         const storedToken = await redis.get(`refresh_token : ${decoded.userId}`);

         if(storedToken !== refreshToken){
            return res.status(401).json({error : "Invalid refresh token"})
         }

         const accessToken = jwt.sign({userId : decoded.userId},process.env.ACCESS_TOKEN_SECRET);

         res.cookie('accessToken',accessToken,{
            httpOnly : true,
            secure : process.env.ENV === 'production',
            sameSite : 'strict',
            maxAge : 15 * 60 * 1000
         })
        res.status(201).json({message : "new access token is generated"})
     } catch (error) {
        res.status(500).json({error : "while refreshtoken " + error.message})
     }
}


export const getProfile = async (req,res)=>{
   try {
      res.status(200).json({user : req.user, message : "user fetched successful"})
   } catch (error) {
      res.status(500).json({error : "while refreshtoken " + error.message})
   }
}