import { createSlice } from "@reduxjs/toolkit";


const navSlice = createSlice({
    name:'Navigation',
    initialState:{
        IsActive:null,
    },
    reducers:{
        setActiveNav:(state,action)=>{
            state.IsActive = action.payload
            localStorage.setItem('ActiveIndex',action.payload)
        }

    }
})

export const {setActiveNav} =  navSlice.actions
export const NavReducer = navSlice.reducer