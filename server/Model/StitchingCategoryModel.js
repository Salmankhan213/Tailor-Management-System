import mongoose from 'mongoose';

const StitchingCategorySchema = new mongoose.Schema({
  TypeStitchingName: {
    type: String,
    required: true
  },
  Image: {
    type: String
  },
  SingleStitching: {
    type: Number,
    required: true
  },
  DoubleStitching: {
    type: Number,
    required: true
  },
}, { timestamps: true ,
  versionKey: false, // disables the __v field
});

export const StitchingCategory = mongoose.model('StitchingCategory', StitchingCategorySchema);




