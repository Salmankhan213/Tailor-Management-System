import mongoose from 'mongoose'


const ExpensesCategorySechama = new mongoose.Schema(
{
  ExpensesCategory: {
        type: String,
        required: [true, 'Expenses Category is required'],
        trim: true,
      },

    },
    { timestamps: true ,
      versionKey: false, // disables the __v field
    }
  );
  
 export const ExpensesCategoryModel = mongoose.model('ExpensesCategories',ExpensesCategorySechama)