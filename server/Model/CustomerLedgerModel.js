import mongoose from 'mongoose'

const CustomerLedgerSechma = new mongoose.Schema({
    PaymentId:{
        type : mongoose.Types.ObjectId,
        ref:'CustomerPayments',
        },
    CustomerId : {
        type : mongoose.Types.ObjectId,
        ref:'Customers',
    },
    OrderId : {
        type : mongoose.Types.ObjectId,
        ref:'Orders',
    },
    Balance:{
        type:Number,
        require:[true,'Balance required']
    },
    Credit:{
        type:Number,
        require:[true,'Credit required']
    },
    Debit:{
        type:Number,
        require:[true,'Debit required']
    },
    Date:{
        type:String,
        require:[true,'Date required']
    },

},
{ timestamps: true ,
    versionKey: false, // disables the __v field
  }
)


export const CustomerLedger = mongoose.model('CustomerLedger',CustomerLedgerSechma)