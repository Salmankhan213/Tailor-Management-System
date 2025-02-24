import mongoose from 'mongoose';


const UserSechama = new mongoose.Schema({
    OperatorName:{
        type:String,
        require:[true , 'Please Provide Operater Name']
    },
    Password:{
        type:String,
        require:[true , 'Please Provide Password']
    },
    Role:{
        type:String,
        require:[true , 'Please Provide Role']
    },
    ContactNo:{
        type:String,
        require:[true , 'Please Provide Contact No'],
        unique:true
    },
    Email:{
        type:String,
        require:[true , 'Please Provide Email'],
        unique:true
    }
})

export const User = mongoose.model('Users',UserSechama)