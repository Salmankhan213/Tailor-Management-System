import mongoose from 'mongoose'


const CustomerMeasurementSechama = new mongoose.Schema(
    {
      CustomerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customers', 
        required: true,
      },
      Date: {
        type: Date,
        required: true,
      },
      TypeStitchingName: {
        type: String,
        required: true,
      },
      Measurement: [{
        detail: {
          type: String,
          required: true,
        },
        value: {
          type: Number,
          required: true,
        },
        
      }]
    },
    { timestamps: true ,
      versionKey: false, // disables the __v field
    }
  );
 export const CustomerMeasurement = mongoose.model('CustomerMeasurement',CustomerMeasurementSechama)