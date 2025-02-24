import { CustomerMeasurement } from "../Model/CustomerMeasurementModel.js";


export const AddCustomerMeasurement = async(req,res,next)=>{
  try {
    const { CustomerId, TypeStitchingName } = req.body;

    const existingMeasurement = await CustomerMeasurement.findOne({
      CustomerId,              
      TypeStitchingName         
    });

    if (existingMeasurement) {
      return res.json({ message: 'This stitching type already exists for this customer', success: false });
    }

    await CustomerMeasurement.create(req.body);
    return res.json({ message: 'Customer measurement added successfully', success: true });
  } catch (error) {
    next(error);
  }
}

export const UpdateCustomerMeasurement = async(req,res,next)=>{
  try {
    const {id} = req.params
    if(!id){
     return res.json({message:'Please Provide the id',success:false})
    }
    const existingCategory = await CustomerMeasurement.findByIdAndUpdate(id,req.body)
    if(!existingCategory){
    return res.json({
      message:'Customer not Found',
      success:false
    })
    }
    return res.json({message:'Customer Updated',success:true})
  } catch (error) {
    next(error)
  }
}
export const GetallCustomerMeasurement = async(req,res,next)=>{
  try {
    const FetchCustomerMeasurement = await CustomerMeasurement.find().populate('CustomerId','CustomerName')
    return res.json({FetchCustomerMeasurement,success:true})
  } catch (error) {
    next(error)
  }
}
export const GetByIdCustomerMeasurement = async (req, res, next) => {
  try {
    const { id, stitching } = req.params;
    const fetchCustomerMeasurement = await CustomerMeasurement.findOne({
      CustomerId: id,
      TypeStitchingName: stitching
    });
    if (!fetchCustomerMeasurement) {
      return res.status(404).json({
        message: "Customer measurement not found",
        success: false
      });
    }
    return res.status(200).json({
      fetchCustomerMeasurement,
      success: true
    });
  } catch (error) {
    next(error); 
  }
};