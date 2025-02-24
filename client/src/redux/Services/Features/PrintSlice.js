import { createSlice } from '@reduxjs/toolkit'


const PrintSlice = createSlice({
    name:'Print',
    initialState:{
        IsActive:false
    },
    reducers:{
        ShowPrint:(state,action)=>{
         state.IsActive = action.payload
        },
        HidePrint:(state,action)=>{
        state.IsActive = action.payload
        }
    }
})

export const {ShowPrint,HidePrint} = PrintSlice.actions
export const  PrintReducer = PrintSlice.reducer