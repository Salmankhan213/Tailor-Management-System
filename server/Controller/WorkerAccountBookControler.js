import { WorkerAccountBook } from "../Model/WorkerAccountBookModel.js"
import {Worker} from "../Model/AddWorkerModel.js"


export const AddWorkerAccount = async (req, res, next) => {
  try {
    const { Date, WorkerId, Action, Money, Detail } = req.body;

    const existingWorker = await Worker.findOne({ _id: WorkerId });
    if (!existingWorker) {
      return res.status(404).json({ message: 'Worker not found', success: false });
    }

    let newWorkerAccount;
    
    if (Action === "Salary" || Action === "Work") {
      newWorkerAccount = {
        Date,
        WorkerId,
        Action,
        Credit: Money,
        Debit: 0,
        Detail
      };
      existingWorker.RemainingDues = existingWorker.RemainingDues - Money;

    } else if (Action === "Loan") {
      newWorkerAccount = {
        Date,
        WorkerId,
        Action,
        Debit: Money,
        Credit: 0,
        Detail
      };

      existingWorker.RemainingDues = existingWorker.RemainingDues + Money;
    }

    const AddWorkerAccountBook = await WorkerAccountBook.create(newWorkerAccount);

    await existingWorker.save();

    if (!AddWorkerAccountBook || !existingWorker) {
      return res.status(403).json({
        message: 'Worker Account Added Failed',
        success: false
      });
    }

    return res.status(201).json({
      message: 'Worker Account Added Successfully',
      success: true
    });

  } catch (error) {
    next(error);
  }
};
export const DeleteWorkerAccount = async(req,res,next)=>{
  try {
    const {id,workerId} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingWorker = await Worker.findOne({_id:workerId})
    const existingWorkerAccount = await WorkerAccountBook.findByIdAndDelete(id)
    console.log('existingWorker',existingWorker)
    console.log('existingWorkerAccount',existingWorkerAccount)
    
     if(existingWorkerAccount.Action === "Salary" || existingWorkerAccount.Action === "Work" ){
      existingWorker.RemainingDues = existingWorker.RemainingDues + existingWorkerAccount.Credit
     }
     else if(existingWorkerAccount.Action === "Loan"){
      existingWorker.RemainingDues = existingWorker.RemainingDues - existingWorkerAccount.Debit
     }
     await existingWorker.save()
    if(!existingWorkerAccount || !existingWorker){
    return res.status(403).json({
      message:'Worker Account not Found',
      success:false
    })
    }

    return res.status(201).json({message:'Worker Account Deleted',success:true})
  } catch (error) {
    next(error)
  }
}

export const GetallWorkerAccount = async(req,res,next)=>{
  try {
    const FetchWorkerAccount = await WorkerAccountBook.find().populate('WorkerId')
    return res.json({FetchWorkerAccount,success:true})
  } catch (error) {
    next(error)
  }
}