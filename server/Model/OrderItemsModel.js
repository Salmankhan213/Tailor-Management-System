import mongoose from 'mongoose'

const OrderItemsSechma = new mongoose.Schema({
    OrderId : {
        type : mongoose.Types.ObjectId,
        ref:'Orders',
        require:[true,'OrderId required']
    },
    CustomerId : {
        type : mongoose.Types.ObjectId,
        ref:'Customers',
        require:[true,'CustomerId required']
    },
    TotalPriceOrder:{
        type:Number,
        require:[true,'TotalPriceOrder required']
    },
    designCode:{
        type:String,
        require:[true,'designCode required']
    },
    details:{
        type:String,
        require:[true,'stitchingPrice required']
    },
    stitchingPrice:{
        type:Number,
        require:[true,'stitchingPrice required']
    },
    stitching:{
        type:String,
        require:[true,'stitching required']
    },
    typeStitching:{
        type:String,
        require:[true,'typeStitching required']
    },
    quantity:{
        type:String,
        require:[true,'quantity required']
    },
    orderDate:{
        type:String,
        require:[true,'TotalPriceOrder required']
    },
    deliveryDate:{
        type:String,
        require:[true,'designCode required']
    },
    status:{
        type:String,
        default:'pending'
    },
},
{ timestamps: true ,
    versionKey: false, // disables the __v field
  } 
)


export const OrderItem = mongoose.model('OrderItem',OrderItemsSechma)