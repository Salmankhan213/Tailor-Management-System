import { StitchingDesign } from "../Model/DesignModel.js";


export const AddDesign = async(req,res,next)=>{
  try {
    await StitchingDesign.create(req.body)
    res.json({message:'Design Added',success:true})
  } catch (error) {
    next(error)
  }
}
export const DeleteDesign = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await StitchingDesign.findByIdAndDelete(id)
    if(!existingCategory){
    return res.json({
      message:'Design not Found',
      success:false
    })
    }
    return res.json({message:'Design Deleted',success:true})
  } catch (error) {
    next(error)
  }
}
export const UpdateDesign = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await StitchingDesign.findByIdAndUpdate(id,req.body)
    if(!existingCategory){
    return res.json({
      message:'Design not Found',
      success:false
    })
    }
    return res.json({message:'Design Updated',success:true})
  } catch (error) {
    next(error)
  }
}
export const GetallDesign = async(req,res,next)=>{
  try {
    const FetchDesign = await StitchingDesign.find()
    return res.json({FetchDesign,success:true})
  } catch (error) {
    next(error)
  }
}