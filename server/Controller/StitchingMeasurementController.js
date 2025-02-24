import {StitchingMeasurements} from '../Model/StitchingMeasurementModel.js'


export const AddStitchingMeasurment = async(req,res,next)=>{
  try {
    const {TypeStitchingName,StitchingDetial} = req.body
   const CategoryId = await StitchingMeasurements.findOne({TypeStitchingId:TypeStitchingName})
    if(CategoryId){
      CategoryId.StitchingDetial.push(StitchingDetial)
      const AddnewList = await StitchingMeasurements.findOneAndUpdate({TypeStitchingId:TypeStitchingName},CategoryId)
      return res.json({AddnewList,message:'Stitching Measurements Added',success:true})


    }
    else{
    const NewMeasurement = {
      TypeStitchingId:TypeStitchingName,
      StitchingDetial
    }
   const AddnewMesurement =  await StitchingMeasurements.create(NewMeasurement)
    return res.json({AddnewMesurement, message:'Stitching Measurements Added',success:true})
    }

  } catch (error) {
    next(error)
  }
}
export const DeleteStitchingMeasurment = async (req, res, next) => {
  try {
    const { id, ind } = req.params;

    if (!id || ind === undefined) {
      return res.status(400).json({ message: 'Please provide the id and index', success: false });
    }

    const existingCategory = await StitchingMeasurements.findById(id);

    if (existingCategory) {
      const newStitchingDetail = existingCategory.StitchingDetial.filter((_, i) => i != ind);
      existingCategory.StitchingDetial = newStitchingDetail;
      await existingCategory.save();

      if (existingCategory.StitchingDetial.length === 0) {
        await StitchingMeasurements.findByIdAndDelete(id);
      }

      return res.json({ message: 'Stitching Measurement Deleted', success: true });
    } else {
      return res.status(404).json({ message: 'Stitching Measurement not found', success: false });
    }
  } catch (error) {
    next(error);
  }
};
export const UpdateStitchingMeasurement = async (req, res, next) => {
  try {
    const { id, ind } = req.params; 
    const  {StitchingDetial}  = req.body; 
    if (!id || ind === undefined || !StitchingDetial) {
      return res.status(400).json({ message: 'Please provide the id, index, and stitching detail', success: false });
    }

   
    const existingCategory = await StitchingMeasurements.findById(id);

    if (!existingCategory) {
      return res.status(404).json({ message: 'Stitching Measurement not found', success: false });
    }

    if (ind >= existingCategory.StitchingDetial.length || ind < 0) {
      return res.status(400).json({ message: 'Invalid index', success: false });
    }
    existingCategory.StitchingDetial[ind] = StitchingDetial;

    await existingCategory.save();

    return res.json({ message: 'Stitching Measurement Updated', success: true });
  } catch (error) {
    next(error); 
  }
};
export const GetallStitchingMeasurment = async(req,res,next)=>{
  try {
    const FetchMeasurement = await StitchingMeasurements.find().populate('TypeStitchingId','TypeStitchingName')
    return res.json({FetchMeasurement,success:true})
  } catch (error) {
    next(error)
  }
}