import { Shop } from '../Model/ShopInformationModal.js';



export const createShopInfo = async (req, res,next) => {
    try {
        const newShop = new Shop(req.body);
        await newShop.save();
       return res.status(201).json({ success: true, message:'Added Successfully' });
    } catch (error) {
        next(error)
    }
};

export const getShopInfo = async (req, res,next) => {
    try {
        const shopInfo = await Shop.findOne();
        if (!shopInfo) {
            return res.status(404).json({ success: false, message: 'Shop information not found' });
        }
        return res.json({ success: true, data: shopInfo });
    } catch (error) {
        next(error)
    }
};

export const updateShopInfo = async (req, res,next) => {
    try {
        const { id } = req.params;
        const updatedShop = await Shop.findByIdAndUpdate(id, req.body);
        if (!updatedShop) {
            return res.status(404).json({ success: false, message: 'Shop information not found' });
        }
       return res.json({ success: true, message:'Updated Successfully' });
    } catch (error) {
        next(error)
    }
};