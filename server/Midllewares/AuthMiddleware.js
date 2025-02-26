import jwt from 'jsonwebtoken'
export const AuthenticateToken = async(req,res,next)=>{
        const token  = req.cookies?.token
        console.log(token)
        if(!token){
            return res.json({
                message:'Please Provide the Token',
                success:false,
            })
        }
         jwt.verify(token,process.env.JWT_KEY , (err,user)=>{
            if(err) return res.json({ message:`Token is Invalid ${err}`,success:false});
            req.user = user
            next()
        })
}