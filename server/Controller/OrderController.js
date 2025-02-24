import { OrderItem } from "../Model/OrderItemsModel.js";
import { Orders } from "../Model/OrderModel.js";
import { Customer } from "../Model/AddCustomerModel.js";
import { CustomerLedger } from "../Model/CustomerLedgerModel.js";
import mongoose from "mongoose";
import dotenv from 'dotenv/config.js'
import nodemailer from 'nodemailer'
import {CustomerMeasurement} from '../Model/CustomerMeasurementModel.js'


export const AddOrder_Items = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { CustomerId, totalItems, TotalPriceOrder, advancePrice, remainingPrice } = req.body;
    
    const missingMeasurements = [];

    for (let item of totalItems) {
      const { typeStitching } = item;
      const existingMeasurement = await CustomerMeasurement.findOne({
        CustomerId,
        TypeStitchingName: typeStitching,
      }).session(session);
      if (!existingMeasurement) {
        missingMeasurements.push(`Measurement missing for typeStitching: ${typeStitching}`);
      }
    }

    if (missingMeasurements.length > 0) {
      await session.abortTransaction();
      session.endSession();
      return res.json({
        message: 'Order not added. Missing measurements found.',
        missingMeasurements,
        success: false,
      });
    }
    const newOrder = {
      CustomerId,
      TotalPriceOrder,
      advancePrice,
      remainingPrice,
    };

    const OrderAdded = await Orders.create([newOrder], { session });
    
    if (OrderAdded) {
      for (let item of totalItems) {
        const { typeStitching, designCode, stitchingPrice, quantity, TotalPriceOrder, details, orderDate, deliveryDate, stitching } = item;

        const newOrderItem = {
          OrderId: OrderAdded[0]._id,
          CustomerId,
          typeStitching,
          stitching,
          designCode,
          stitchingPrice,
          quantity,
          TotalPriceOrder,
          details,
          orderDate,
          deliveryDate,
        };

        const newLedger = {
          CustomerId,
          OrderId: OrderAdded[0]._id,
          Balance: 0,
          Credit: advancePrice,
          Debit: TotalPriceOrder,
          Date: orderDate,
        };

        await OrderItem.create([newOrderItem], { session });
        await CustomerLedger.create([newLedger], { session });
      }
    }

    const existingCustomer = await Customer.findOne({ _id: CustomerId }).session(session);
    if (!existingCustomer) {
      return res.status(403).json({
        message: 'Customer Not Found',
        success: false,
      });
    }

    if (remainingPrice) {
      existingCustomer.RemainingDues += remainingPrice;
    } else {
      existingCustomer.RemainingDues += TotalPriceOrder;
    }
    await existingCustomer.save({ session });

    await session.commitTransaction();
    session.endSession();
    return res.status(201).json({
      message: 'Order and Order Item Added Successfully!',
      success: true,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

export const DeleteOrder_Items = async (req, res, next) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    
    const { OrderId } = req.params;
    const deleteOrder = await Orders.findOneAndDelete({ _id: OrderId }).session(session);
    
    if (!deleteOrder) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        message: 'Order not found',
        success: false
      });
    }

    await OrderItem.deleteMany({ OrderId }).session(session);

    const existingCustomer = await Customer.findOne({ _id: deleteOrder.CustomerId });
    
    if (existingCustomer) {
      existingCustomer.RemainingDues -= deleteOrder.remainingPrice;
      await existingCustomer.save({ session });
    }

    await CustomerLedger.findOneAndDelete({ OrderId: deleteOrder._id }).session(session);
    
    await session.commitTransaction();
    session.endSession();
    
    return res.status(200).json({
      message: 'Order Deleted',
      success: true
    });

  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};


export const GetOrder_Items = async(req,res,next)=>{
try {
    const FetchOrder = await OrderItem.find().populate('CustomerId')
    if(FetchOrder){
     res.status(201).json({
        FetchOrder
     })
    }
} catch (error) {
    next(error)
}
}
export const StatusOrder_Items = async(req,res,next)=>{
try {
    const {id} = req.params
    const FetchOrder = await OrderItem.findOne({_id:id})
    FetchOrder.status = 'delivered'

    await FetchOrder.save()
    if(!FetchOrder){
     res.status(403).json({
        message:'Order not Found',
        success:false
     })
    }
    res.status(201).json({
        message:'Order Delivered',
        success:true
     })
} catch (error) {
    next(error)
}
}
export const GetByIdOrder_Items = async(req,res,next)=>{
try {
    const {id} = req.params
    const FetchOrder = await OrderItem.findOne({_id:id}).populate('CustomerId')
    if(FetchOrder){
     res.status(201).json({
        FetchOrder
     })
    }
} catch (error) {
    next(error)
}
}

export const ReadyOrder_item = async (req, res, next) => {
  try {
    const orderId = req.params.id;
    const order = await OrderItem.findById(orderId);

    if (!order) {
      return res.status(404).send('Order not found');
    }

    const existingCustomer = await Customer.findOne({ _id: order.CustomerId });

    if (!existingCustomer) {
      return res.status(404).send('Customer not found');
    }

    order.status = 'Ready';
    await order.save();

    const Name = existingCustomer.CustomerName || 'Please Come'
    const testAccount =  nodemailer.createTestAccount()
    const transporter =  nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "nyah.veum@ethereal.email",
        pass: "gYmf898jqVqD3tb8TJ",
      },
    })

    const info = await transporter.sendMail({
      from: '"NPS Tailor 👻" <abcdf123@gmail.com>',
      to: "mpsalman05@gmail.com", 
      subject: "Hello ✔",
      text: `${Name} Your Order is Ready`,
      html: "<b>`Hello I am Malak Salman Mp This Mail For You.Your Order is Ready`</b>",
    })
  
     res.status(201).json({
      message:'Mail Sent Successfully',
      success:true,
      info:info
     })

  } catch (error) {
    next(error);
  }
};

export const GetOrder_Progress = async(req,res,next)=>{
  try {
    const OrderProgress = await OrderItem.aggregate([
      { 
        $match:{
          $or: [
            { status: "Ready" },
            { status: "pending" }
          ],
      }
      
      },
      {
      $lookup: {
        from: 'orders',
        localField: 'OrderId',
        foreignField: '_id',
        as: 'orders'
      }
    },
    {
      $unwind:'$orders'
    },
    {
      $lookup:{
        from:'customers',
        localField:'CustomerId',
        foreignField:'_id',
        as:'CustomerData'
      },
    },
    {
      $unwind:'$CustomerData'
    },
    {
      $project:{
        OrderId:1,
        CustomerId:1,
        CustomerName:'$CustomerData.CustomerName',
        TotalPrice: '$orders.TotalPriceOrder',
        AdvancePrice:'$orders.advancePrice',
        status:1,
        orderDate:1,
        deliveryDate:1,
        typeStitching:1,
        stitchingPrice:1,
        quantity:1,
        TotalPriceOrder:1,
      }
    }
    ])

    if(!OrderProgress){
        return res.status(500).json({
        success:false,
        message:'Order Not Found',
        OrderProgress,
       })
    }
   return res.status(201).json({
    success:true,
    OrderProgress,
   })
  } catch (error) {
    next(error)
  }
}