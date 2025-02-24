
import {AddExpenses} from '../Model/AddExpensesModel.js'
import {CustomerPayment} from '../Model/CustomerPaymentModel.js'
import {OrderItem} from '../Model/OrderItemsModel.js'
import {WorkerAccountBook} from '../Model/WorkerAccountBookModel.js'

export const Daily_Outstanding = async()=>{
    try {
        const date = new Date().toISOString().split('T')[0]
       
       const Expenses = await AddExpenses.aggregate([
        {
            $match:{
                Date:date,
            },
        },
        {
            $group:{
                _id:null,
                totalExpenses:{$sum:"$ExpensesAmount"}
            }
        }
       ]) 

       const CusPayment = await CustomerPayment.aggregate([
        {
            $match:{
                Date:date
            }
        },
        {
            $group:{
                _id:null,
                totalRemainingDues:{$sum:'$RemainingDues'},
                totalReceiptAmount:{$sum:'$ReceiptAmount'}
            }
        }
       ])

       const order = await OrderItem.aggregate([
        {
            $match:{
                orderDate:date,
                status:'pending'
            }
        },
        {
            $group:{
                _id:null,
                totalOrderPrice:{$sum:'$TotalPriceOrder'},
                totalStitchingPrice:{$sum:'$stitchingPrice'}
            }
        }
       ])
       const WorkerBook = await WorkerAccountBook.aggregate([
        {
            $match:{
                Date:date,
            }
        },
        {
            $group:{
                _id:null,
                totalCredit:{$sum:'$Credit'},
                totalDebit:{$sum:"$Debit"}
            }
        }
       ])

       const result = {
        date,
        totalExpenses: Expenses[0]?.totalExpenses || 0,
        totalRemainingDues: CusPayment[0]?.totalRemainingDues || 0,
        totalReceipt: CusPayment[0]?.totalReceiptAmount || 0,
        totalOrderAmount: order[0]?.totalOrderPrice || 0,
        totalStitchingAmount: order[0]?.totalStitchingPrice || 0,
        totalCredit: WorkerBook[0]?.totalCredit || 0,
        totalDebit: WorkerBook[0]?.totalDebit || 0
    };
    const totalIncoming = result.totalReceipt + result.totalOrderAmount;
    const totalOutgoing = result.totalExpenses + result.totalDebit + result.totalRemainingDues + result.totalCredit;
    result.DailyAmount = totalIncoming - totalOutgoing
       return result;

    } catch (error) {
       console.error('Error daily outStanding',error)
       return {errors:`Internal Server error ${error}`}
    }
}
export const OverAll_Outstanding = async()=>{
    try {
       
       const Expenses = await AddExpenses.aggregate([
        {
            $group:{
                _id:null,
                totalExpenses:{$sum:"$ExpensesAmount"}
            }
        }
       ]) 

       const CusPayment = await CustomerPayment.aggregate([
        {
            $group:{
                _id:null,
                totalRemainingDues:{$sum:'$RemainingDues'},
                totalReceiptAmount:{$sum:'$ReceiptAmount'}
            }
        }
       ])

       const order = await OrderItem.aggregate([
        {
            $group:{
                _id:null,
                totalOrderPrice:{$sum:'$TotalPriceOrder'},
                totalStitchingPrice:{$sum:'$stitchingPrice'}
            }
        }
       ])
       const WorkerBook = await WorkerAccountBook.aggregate([
        {
            $group:{
                _id:null,
                totalCredit:{$sum:'$Credit'},
                totalDebit:{$sum:"$Debit"}
            }
        }
       ])

       const result = {
        totalExpenses: Expenses[0]?.totalExpenses || 0,
        totalRemainingDues: CusPayment[0]?.totalRemainingDues || 0,
        totalReceipt: CusPayment[0]?.totalReceiptAmount || 0,
        totalOrderAmount: order[0]?.totalOrderPrice || 0,
        totalStitchingAmount: order[0]?.totalStitchingPrice || 0,
        totalCredit: WorkerBook[0]?.totalCredit || 0,
        totalDebit: WorkerBook[0]?.totalDebit || 0
    };
    const totalIncoming = result.totalReceipt + result.totalOrderAmount;
    const totalOutgoing = result.totalExpenses + result.totalDebit + result.totalRemainingDues + result.totalCredit;
    result.OverAllAmount = totalIncoming - totalOutgoing
       return result;
    } catch (error) {
        console.error(`eror overall outstanding ${error}`)
        return {error:'overall outstanding error Accured'}
    }
}