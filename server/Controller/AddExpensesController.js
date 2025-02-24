import {AddExpenses} from '../Model/AddExpensesModel.js'


export const Add_Expenses = async(req,res,next)=>{
  try {
    const {Date,TypeExpenses,ExpensesAmount,Detail} = req.body;
      await AddExpenses.create(req.body)
      return res.json({message:'Expenses Added successfully',success:true})
  } catch (error) {
    next(error)
  }
}
export const Delete_Expenses= async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCustomer = await AddExpenses.findByIdAndDelete(id)
    if(!existingCustomer){
    return res.status(403).json({
      message:'Expenses not Found',
      success:false
    })
    }

    return res.status(201).json({message:'Expenses Deleted',success:true})
  } catch (error) {
    next(error)
  }
}
export const Update_Expenses = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await AddExpenses.findByIdAndUpdate(id,req.body)
    if(!existingCategory){
    return res.json({
      message:'Expenses  not Found',
      success:false
    })
    }
    return res.json({message:'Expenses  Updated',success:true})
  } catch (error) {
    next(error)
  }
}
export const Getall_Expenses = async(req,res,next)=>{
  try {
    const FetchExpenses = await AddExpenses.find()
    return res.json({FetchExpenses,success:true})
  } catch (error) {
    next(error)
  }
}