import {AddExpenses} from '../Model/AddExpensesModel.js'
import {WorkerAccountBook} from '../Model/WorkerAccountBookModel.js'
import {OrderItem} from '../Model/OrderItemsModel.js'
import mongoose from 'mongoose';

export const GetAllReports = async(req,res,next)=>{
    try {
        const {typeReport,WorkerName,startDate,endDate} = req.query

        switch (typeReport) {
            case 'order': {
              const reports = await OrderItem.aggregate([
                {
                    $match:{
                    orderDate:{
                        $gte:startDate,
                        $lte:endDate
                    }
                    }
                },
               {
                $lookup:{
                    from:'orders',
                    localField:'OrderId',
                    foreignField:'_id',
                    as:'OrderInfo'
                }
               },
               {
                $lookup:{
                    from:'customers',
                    localField:'CustomerId',
                    foreignField:'_id',
                    as:'CustomerInfo'
                }
               },
               {
                $unwind:'$OrderInfo'
               },
               {
                $unwind:'$CustomerInfo'
               },
               {
                $project:{
                  _id:1,
                  orderDate:1,
                  typeStitching:1,
                  stitchingPrice:1,
                  quantity:1,
                  deliveryDate:1,
                  OrderAmount:'$OrderInfo.TotalPriceOrder',
                  AdvanceAmount:'$OrderInfo.advancePrice',
                  RemainingDues:'$OrderInfo.remainingPrice',
                  CustomerName:'$CustomerInfo.CustomerName',
                  
                }
               },
               {
                $group: {
                    _id: null,
                    totalOrderAmount: { $sum: '$OrderAmount' },
                    totalAdvanceAmount:{$sum:'$AdvanceAmount'},
                    totalRemainingDues: { $sum: '$RemainingDues' },
                    reports: { $push: '$$ROOT' }  // This keeps all individual reports data
                }
            },
            {
                $project: {
                    _id: 0,
                    totalOrderAmount: 1,
                    totalRemainingDues: 1,
                    totalAdvanceAmount:1,
                    reports: 1
                }
            }
              ])
              if(reports.length === 0){
                return res.json({
                    message:'Report not Found',
                    success:false
                  })

              }else{
                return res.json({
                    reports,
                    success:true
                  })
              }
           
            }
      
            case 'expenses': {
              const reports = await AddExpenses.aggregate([
                {
                    $match:{
                        Date:{
                            $gte:startDate,
                            $lte:endDate
                        },
                    }
                },
              ])
              if(reports.length === 0){
                return res.json({
                  success:false,
                  message:'Report Not Found'
                 });
              }
              return res.json({
               success:true,
               reports
              });
            }
            case 'worker': {
               const reports = await WorkerAccountBook.aggregate([
                {
                  $match:{
                    WorkerId: new mongoose.Types.ObjectId(WorkerName),
                    Date:{
                      $gte:startDate,
                      $lte:endDate,
                    }
                  },
                },
                {
                  $lookup:{
                    from:'workers',
                    localField:'WorkerId',
                    foreignField:'_id',
                    as:'WorkerInfo'
                  }
                },
                {
                  $unwind:'$WorkerInfo'
                },
                {
                  $project:{
                    _id:1,
                    Date:1,
                    Action:1,
                    Credit:1,
                    Debit:1,
                    Detail:1, 
                    WorkerName:'$WorkerInfo.WorkerName'
                  }
                },
                {
                  $group:{
                    _id:null,
                    TotalCredit:{$sum:'$Credit'},
                    TotalDebit:{$sum:'$Debit'},
                    reports: { $push: '$$ROOT' }
                  }
                },
                {
                  $project:{
                    _id:0,
                    TotalCredit:1,
                    TotalDebit:1,
                    reports:1,
                  }
                }
               ])
              if(reports.length === 0){
                return res.json({
                  message:'Data Not Found',
                  success:false,
                 });
              }else{
                return res.json({
                 success:true,
                 reports
                });
              }
            }
      
            default:
              return res.status(400).json({ message: 'Invalid report type',success:false });
          }
        } catch (error) {
          return res.status(500).json({ message: "Server Error", error ,success:false });
        }
      };