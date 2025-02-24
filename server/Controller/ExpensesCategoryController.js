import {ExpensesCategoryModel} from '../Model/ExpensesCategoryModel.js'


export const AddExpenses_Category = async(req,res,next)=>{
  try {
    const {ExpensesCategory} = req.body;
      const existingCustomer = await ExpensesCategoryModel.findOne({ExpensesCategory})
      if(existingCustomer){
        return res.json({message:'Expenses Category already Registered',success:false})
      }
      await ExpensesCategoryModel.create(req.body)
      return res.json({message:'Expenses Category Added successfully',success:true})
  } catch (error) {
    next(error)
  }
}
export const DeleteExpenses_Category= async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCustomer = await ExpensesCategoryModel.findByIdAndDelete(id)
    if(!existingCustomer){
    return res.status(403).json({
      message:'Expenses Category not Found',
      success:false
    })
    }

    return res.status(201).json({message:'Expenses Category Deleted',success:true})
  } catch (error) {
    next(error)
  }
}
export const UpdateExpenses_Category = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await ExpensesCategoryModel.findByIdAndUpdate(id,req.body)
    if(!existingCategory){
    return res.json({
      message:'Expenses Category not Found',
      success:false
    })
    }
    return res.json({message:'Expenses Category Updated',success:true})
  } catch (error) {
    next(error)
  }
}
export const GetallExpenses_Category = async(req,res,next)=>{
  try {
    const FetchExpensesCategory = await ExpensesCategoryModel.find()
    return res.json({FetchExpensesCategory,success:true})
  } catch (error) {
    next(error)
  }
}