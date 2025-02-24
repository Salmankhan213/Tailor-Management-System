import mongoose from 'mongoose'


const WorkerAccountBookSechama = new mongoose.Schema(
    {
      WorkerId: {
        type: mongoose.Types.ObjectId,
        ref:'Workers',
        trim: true,
        required: [true, 'Worker Id is required'],
      },
      Date: {
        type: String,
        trim: true,
        required: [true, 'Date is required'],
      },
      Action: {
        type: String,
        trim: true,
        required: [true, 'Action is required'],
      },
      Credit: {
        type: Number,
        trim: true,
      },
      Detail: {
        type: String,
        required: [true, 'Detail is required'],
        trim: true,
        minlength: [3, 'Detail must be at least 5 characters'],
        maxlength: [200, 'Detail cannot exceed 500 characters'],
      },
      Debit: {
        type: Number,
        trim: true,
      },
    },
    { timestamps: true ,
      versionKey: false, // disables the __v field
    }
  );
  
 export const WorkerAccountBook = mongoose.model('WorkerAccountBooks',WorkerAccountBookSechama)