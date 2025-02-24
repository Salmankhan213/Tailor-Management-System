import mongoose from 'mongoose'


const AddCustomerSechama = new mongoose.Schema(
    {
      CustomerName: {
        type: String,
        required: [true, 'Customer Name is required'],
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
      Profession: {
        type: String,
        required: [true, 'Profession is required'],
        trim: true,
        minlength: [2, 'Profession must be at least 2 characters'],
        maxlength: [100, 'Profession cannot exceed 100 characters'],
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
        default:0
      },
    },
    { timestamps: true,
      versionKey: false, // disables the __v field
     },

  );
  
 export const Customer = mongoose.model('Customers',AddCustomerSechama)