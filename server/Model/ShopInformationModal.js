import mongoose from 'mongoose';

const ShopSchema = new mongoose.Schema({
    shopName: {
        type: String,
        required: true,
        trim: true,
    },
    shopOwnerName: {
        type: String,
        required: true,
        trim: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    contactNumber: {
        type: String,
        required: true,
        trim: true,
    },
    city: {
        type: String,
        required: true,
        trim: true,
    },
}, { timestamps: true });

export const Shop = mongoose.model('Shop', ShopSchema);