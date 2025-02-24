
export const AuthenticateAdmin = async(req,res,next)=>{
    const isAdmin = req.user?.MatchEmail.Role == 'admin'
    if(!isAdmin){
        return res.json({
             success: false,
             message: 'Unauthorized: Only admins can perform this action.'
        })
    }else{
        next()
    }
}