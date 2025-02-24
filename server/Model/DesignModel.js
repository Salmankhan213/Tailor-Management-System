import mongoose from 'mongoose';

const DesignSchema = new mongoose.Schema({
  DesignName: {
    type: String,
    required: true
  },
  Image: {
    type: String
  },
}, { timestamps: true ,
  versionKey: false, // disables the __v field
}
);

export const StitchingDesign = mongoose.model('StitchingDesign', DesignSchema);


