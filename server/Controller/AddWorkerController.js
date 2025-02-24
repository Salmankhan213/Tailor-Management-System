import {Worker} from '../Model/AddWorkerModel.js'
import { WorkerAccountBook } from '../Model/WorkerAccountBookModel.js';

export const AddWorker = async(req,res,next)=>{
  try {
    const { WorkerName, PhoneNo, CnicNo, Address,} = req.body;
      const existingCustomer = await Worker.findOne({CnicNo})
      if(existingCustomer){
        return res.json({message:'Worker already Registered',success:false})
      }
       await Worker.create(req.body)
      return res.json({message:'Worker Added successfully',success:true})
  } catch (error) {
    next(error)
  }
}
export const DeleteWorker = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingWorker = await Worker.findByIdAndDelete(id)
    await WorkerAccountBook.deleteMany({WorkerId:id})
    if(!existingWorker){
    return res.status(403).json({
      message:'Worker not Found',
      success:false
    })
    }

    return res.status(201).json({message:'Worker Deleted',success:true})
  } catch (error) {
    next(error)
  }
}
export const UpdateWorker = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const AddWorkerdata = await Worker.findByIdAndUpdate(id,req.body)
    if(!AddWorkerdata){
    return res.json({
      message:'Worker not Found',
      success:false
    })
    }
    if(AddWorkerdata){
      return res.json({message:'Worker Updated',success:true})
    }
   
  } catch (error) {
    next(error)
  }
}
export const GetallWorker = async(req,res,next)=>{
  try {
    const FetchWorker = await Worker.find()
    return res.json({FetchWorker,success:true})
  } catch (error) {
    next(error)
  }
}