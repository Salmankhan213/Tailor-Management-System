import mongoose from 'mongoose'


const CustomerPaymentSechama = new mongoose.Schema(
    {
      CustomerId: {
        type: mongoose.Types.ObjectId,
        required: [true, 'CustomerId is required'],
      },
      CustomerName: {
        type: String,
        required: [true, 'Customer Name is required'],
      },
      RemainingDues: {
        type: Number,
        required: [true, 'Remaining Dues is required'],
        trim: true,
      },
      ReceiptAmount: {
        type: Number,
        trim:true,
        required: [true, 'Receipt Amount is required'],
      },
      Detail: {
        type: String,
        required: [true, 'Detail is required'],
        trim: true,
        minlength: [2, 'Detail must be at least 2 characters'],
        maxlength: [50, 'Detail cannot exceed 100 characters'],
      },
      Date: {
        type: String,
        required: [true, 'Date is required'],
        trim: true,
      },
    },
    { timestamps: true ,
      versionKey: false, // disables the __v field
    }
  );
  
 export const CustomerPayment = mongoose.model('CustomerPayments',CustomerPaymentSechama)