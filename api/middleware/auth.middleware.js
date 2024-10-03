import jwt from "jsonwebtoken";
import User from "../models/user.model.js ";

export const protechRoute = async (req,res,next)=>{
    try {
        const accessToken = req.cookies.accessToken;
        if(!accessToken){
            return res.status(401).json({error : "Unauthorized - No access token provided"})
        }

        try {
            const decoded = jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
            if(!decoded){
               return res.status(401).json({error : "Invalid access token"})
            }
    
            const user = await User.findById(decoded.userId).select("-password");
    
            if(!user){
                return res.status(404).json({error : "User not found"})
            }
    
            req.user = user;
            next();   
        } catch (error) {
            if(error.name === 'TokenExpiredError'){
                return res.status(401).json({error : 'Unauthorized - Access token expired'})
            }
            throw error
        }
    } catch (error) {
        res.status(500).json({error : "while authorisation "+error.message});
    }
}

export const adminRoute = (req,res,next)=>{
    if(req.user && req.user.role === 'admin') next();
    else return res.status(403).json({error : "Access denied - Admin only"})
}