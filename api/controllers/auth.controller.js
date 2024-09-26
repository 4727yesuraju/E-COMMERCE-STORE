export const signup = async (req,res)=>{
     try {
        res.send("signup");
     } catch (error) {
        res.status(500).json({error : "while signup " + error.messge})
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