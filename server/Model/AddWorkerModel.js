import mongoose from 'mongoose'


const AddWorkerSechama = new mongoose.Schema(
    {
      WorkerName: {
        type: String,
        required: [true, 'Worker Name is required'],
        trim: true,
        minlength: [2, 'Customer Name must be at least 2 characters'],
        maxlength: [100, 'Customer Name cannot exceed 100 characters'],
      },
      PhoneNo: {
        type: String,
        required: [true, 'Phone Number is required'],
        trim: true,
      },
      CnicNo: {
        type: String,
        required: [true, 'CNIC Number is required'],
        trim: true,
        unique: true,
      },
      Address: {
        type: String,
        required: [true, 'Address is required'],
        trim: true,
        minlength: [3, 'Address must be at least 5 characters'],
        maxlength: [200, 'Address cannot exceed 500 characters'],
      },
      RemainingDues: {
        type: Number,
      },
        },
        
        { timestamps: true ,
          versionKey: false, // disables the __v field
        }
  );
  
 export const Worker = mongoose.model('Workers',AddWorkerSechama)