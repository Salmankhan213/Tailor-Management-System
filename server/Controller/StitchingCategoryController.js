import { StitchingCategory } from "../Model/StitchingCategoryModel.js";


export const AddStitchingCategory = async(req,res,next)=>{
  try {
    await StitchingCategory.create(req.body)
    res.json({message:'Stitching Category Added',success:true})
  } catch (error) {
    next(error)
  }
}
export const DeleteStitchingCategory = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await StitchingCategory.findByIdAndDelete(id)
    if(!existingCategory){
    return res.json({
      message:'Stitching Category not Found',
      success:false
    })
    }
    return res.json({message:'Stitching Category Deleted',success:true})
  } catch (error) {
    next(error)
  }
}
export const UpdateStitchingCategory = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await StitchingCategory.findByIdAndUpdate(id,req.body)
    if(!existingCategory){
    return res.json({
      message:'Stitching Category not Found',
      success:false
    })
    }
    return res.json({message:'Stitching Category Updated',success:true})
  } catch (error) {
    next(error)
  }
}
export const GetallStitchingCategory = async(req,res,next)=>{
  try {
    const FetchCategory = await StitchingCategory.find()
    return res.json({FetchCategory,success:true})
  } catch (error) {
    next(error)
  }
}