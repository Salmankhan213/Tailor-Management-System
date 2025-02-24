import {Customer} from '../Model/AddCustomerModel.js'
import { CustomerMeasurement } from '../Model/CustomerMeasurementModel.js';
import {Orders} from '../Model/OrderModel.js'
import {OrderItem} from '../Model/OrderItemsModel.js'
import {CustomerPayment} from '../Model/CustomerPaymentModel.js'
import { CustomerLedger } from '../Model/CustomerLedgerModel.js';


export const AddCustomer = async(req,res,next)=>{
  try {
    const { CustomerName, PhoneNo, CnicNo, Profession, Address } = req.body;
      const existingCustomer = await Customer.findOne({CnicNo})
      if(existingCustomer){
        return res.json({message:'Customer already Registered',success:false})
      }
      else{
        await Customer.create(req.body)
       return res.json({message:'Customer Added successfully',success:true})
      }
  } catch (error) {
    next(error)
  }
}
export const DeleteCustomer = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCustomer = await Customer.findByIdAndDelete(id)
    if(!existingCustomer){
    return res.status(403).json({
      message:'Customer not Found',
      success:false
    })
    }
      await CustomerLedger.deleteMany({CustomerId:existingCustomer._id})
      await CustomerMeasurement.deleteMany({CustomerId:existingCustomer._id})
      await Orders.deleteMany({CustomerId:existingCustomer._id})
      await OrderItem.deleteMany({CustomerId:existingCustomer._id})
      await CustomerPayment.deleteMany({CustomerId:existingCustomer._id})

    return res.status(201).json({message:'Customer Deleted',success:true})
  } catch (error) {
    next(error)
  }
}
export const UpdateCustomer = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await Customer.findByIdAndUpdate(id,req.body)
    if(!existingCategory){
    return res.json({
      message:'Customer not Found',
      success:false
    })
    }
    return res.json({message:'Customer Updated',success:true})
  } catch (error) {
    next(error)
  }
}
export const GetallCustomer = async(req,res,next)=>{
  try {
    const FetchCustomer = await Customer.find()
    return res.json({FetchCustomer,success:true})
  } catch (error) {
    next(error)
  }
}