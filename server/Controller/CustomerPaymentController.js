import { CustomerPayment } from "../Model/CustomerPaymentModel.js"
import { Customer } from "../Model/AddCustomerModel.js"
import { Orders } from "../Model/OrderModel.js"
import { OrderItem } from "../Model/OrderItemsModel.js"
import mongoose, { startSession } from "mongoose"
import { CustomerLedger } from "../Model/CustomerLedgerModel.js"

export const  AddCustomer_Payment = async (req,res,next)=>{
  const session = await mongoose.startSession()
    try {
      session.startTransaction()
        const {CustomerId,CustomerName,RemainingDues,ReceiptAmount,Detail,Date} = req.body
        if(RemainingDues === 0){
          await session.abortTransaction()
          session.endSession()
          return res.status(400).json({
            message:'No dues on Customer',
            success:false
          })
        }
        if(ReceiptAmount > RemainingDues){
          await session.abortTransaction()
          session.endSession()
          return res.status(400).json({
            message:'Paid Amount Exceeds From the limit',
            success:false
          })
        }
        const newobject = {
            CustomerId,
            CustomerName,
            RemainingDues,
            ReceiptAmount,
            Detail,
            Date
        }
        const addpayment =   await CustomerPayment.create(newobject)
          const newLedger = {
            PaymentId:addpayment._id,
            CustomerId,
            Debit:0,
            Credit:ReceiptAmount,
            Balance:0,
            Date,
          }
        await CustomerLedger.create([newLedger],{session})
        const findCustomer =   await Customer.findOne({_id:CustomerId}).session(session)
        if(!findCustomer){
          await session.abortTransaction()
          session.endSession()
            return res.status(400).json({
                messsage:'Customer Not FOUND ',
                success:false
            })
        }
        findCustomer.RemainingDues = findCustomer.RemainingDues - ReceiptAmount
        await findCustomer.save({session})

        await session.commitTransaction()
        session.endSession()
        return res.status(200).json({
            message:'Payment Added Successfully!',
            success:true
        })


    } catch (error) {
      await session.abortTransaction()
      session.endSession()
        next(error)
    }
}
export const GetCustomer_Payment = async (req,res,next)=>{
  try {
    const {id} = req.params
    const FetchPayment = await CustomerPayment.find({CustomerId:id})
    if(!FetchPayment || FetchPayment.lenght === 0){
        return res.status(201).json({
            message:'Payment data Not Found',
            success:false
        })
    }
    return res.status(201).json({
        FetchPayment,
        success:true
    })
  } catch (error) {
    next(error)
  }
}
export const DeleteCustomer_Payment = async (req,res,next)=>{
  const session = await mongoose.startSession()
  try {
    session.startTransaction()
    const {PaymentId,CustomerId} = req.params
    const FetchPayment = await CustomerPayment.findOneAndDelete({_id:PaymentId},{session})
    if(!FetchPayment){
        return res.status(400).json({
            message:'Payment Not Found',
            success:true
        })
    }
     await CustomerLedger.findOneAndDelete({PaymentId},{session})
    const existingCustomer = await Customer.findOne({_id:CustomerId}).session(session)

    existingCustomer.RemainingDues = existingCustomer.RemainingDues + FetchPayment.ReceiptAmount

   const updateCustomer =  await existingCustomer.save({session})
    await session.commitTransaction()
    session.endSession()
   if(updateCustomer && FetchPayment){
    return res.status(201).json({
        message:'Payment Deleted!',
        success:true
    })
   }

  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    next(error)
  }
}
export const GetCustomerLegder = async (req,res,next)=>{
  try {
    const {CustomerId,startDate,endDate} = req.body
   
 const FetchLedger = await CustomerLedger.aggregate([
  {
    $match:{
      CustomerId: new mongoose.Types.ObjectId(CustomerId),
      Date:{
        $gte: startDate,
         $lte: endDate,
      }
    }
  }
 ])
 if(!FetchLedger){
  return res.json({
    message:"Don't have Ledger",
    success:false
  })
 }
 return res.status(201).json({
  success:true,
  FetchLedger
})
  } catch (error) {
    next(error)
  }
}
