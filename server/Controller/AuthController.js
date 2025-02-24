import { User } from "../Model/UserModel.js";
import bcrypt from 'bcrypt'
import jwttoken from 'jsonwebtoken'


export const UserLogin = async(req,res,next)=>{
    try {
      const {Email,Password} = req.body
      const MatchEmail = await User.findOne({Email})
      if(!MatchEmail){
        return res.json({
            message:'Invalid Email and Password',
            success:false
        })
      }
      const hashPassword = MatchEmail.Password
      const MatchPassword = await bcrypt.compare(Password, hashPassword)
      if(!MatchPassword){
        return res.json({
            message:'Invalid Email and Password',
            success:false
        })
      }else{
        const token = await jwttoken.sign({MatchEmail},process.env.JWT_KEY, { expiresIn: '1d' })
        const username = MatchEmail.OperatorName

        res.cookie('token', token, );
        res.cookie('username', username,);
        return res.json({
            message:'Login successfully!',
            success:true,
        })
      }
    } catch (error) {
        next(error)
    }
}
export const UserRegister = async(req,res,next)=>{
    try {
     const {OperatorName,Password,Role,ContactNo,Email} = req.body
 
     const ExistingUser = await User.findOne({Email})
     if(ExistingUser){
        return res.json({
            message:'User Already Registered',
            success:false,
        })
     }else{
        const hashPassword = await bcrypt.hash(Password,10)
        const NewUser = {OperatorName,Password:hashPassword,Role,ContactNo,Email}
        const AddedUser = await User.create(NewUser)
        if(AddedUser){
            return res.json({
                message:'User Added Successfully!',
                success:true,
            })
        }
     }

    } catch (error) {
        next(error)
    }
}

export const Delete_User = async(req,res,next)=>{
    try {
     const {id} = req.params
       
     if(!id){
        return res.json({
            message:'Please Provide Id',
            success:false
        })
    }else{

        const DeletedUser = await User.findByIdAndDelete(id)
        if(!DeletedUser){
            return res.json({
                message:'User Not Found',
                success:false
            })
            
        }else{
            return res.json({
                message:'User Deleted Successfully',
                success:true,
            })
        }
    }
    } catch (error) {
        next(error)
    }
}


export const GetAll_User = async(req,res,next)=>{
    try {
    const FetchUser = await User.find()
    if(!FetchUser){
        return res.json({
            message:'User Not Found',
            success:false
        })
    }else{
        return res.json(FetchUser)
    }
    } catch (error) {
        next(error)
    }
}