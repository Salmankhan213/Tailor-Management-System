import mongoose from 'mongoose'

const OrderSechma = new mongoose.Schema({
    CustomerId : {
        type : mongoose.Types.ObjectId,
        ref:'Customers',
        require:[true,'OrderId required']
    },
    TotalPriceOrder:{
        type:Number,
        require:[true,'typeStitching required']
    },
    advancePrice:{
        type:Number,
        require:[true,'quantity required']
    },
    remainingPrice:{
        type:Number,
        require:[true,'quantity required']
    },

},
{ timestamps: true ,
    versionKey: false, // disables the __v field
  }

)


export const Orders = mongoose.model('Orders',OrderSechma)