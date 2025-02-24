import mongoose from 'mongoose'


const AddExpensesSechama = new mongoose.Schema(
    {
      Date: {
        type: String,
        required: [true, 'Date is required'],
        trim: true,
      },
      TypeExpenses: {
        type: String,
        required: [true, 'Type Expenses is required'],
        trim: true,
      },
      ExpensesAmount: {
        type: Number,
        required: [true, 'Expenses Amount is required'],
        trim: true,
      },
      Detail: {
        type: String,
        trim: true,
      },
    },
    { timestamps: true ,
      versionKey: false, // disables the __v field
    }
  );
  
 export const AddExpenses = mongoose.model('Expenses',AddExpensesSechama)