import mongoose from 'mongoose';

const StitchingMeasurement = new mongoose.Schema({

  TypeStitchingId: {
    type: mongoose.Types.ObjectId,
    ref:'StitchingCategory',
    required: true
  },
  StitchingDetial: [{
    type: String,
    required: true
  }],
  
}, { timestamps: true ,
  versionKey: false, // disables the __v field
});

export const StitchingMeasurements = mongoose.model('StitchingMeasurement', StitchingMeasurement);

