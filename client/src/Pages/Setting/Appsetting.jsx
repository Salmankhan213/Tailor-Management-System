import React, { useEffect, useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import {useGetShopInfoQuery,useUpdateShopInfoMutation,useCreateShopInfoMutation} from '../../redux/Services/AppsettingApi';
import {showErrorAlert,showSuccessAlert} from '../../util/SweetalertHelper'

const Appsetting = () => {
    const { data: shopData,} = useGetShopInfoQuery();
    const [createShopInfo] = useCreateShopInfoMutation();
    const [updateShopInfo] = useUpdateShopInfoMutation();
    const [shopId, setShopId] = useState(null)


    useEffect(()=>{
      setShopId(shopData?.data?._id)
    },[shopData])


    console.log(shopId)

    const initialValues = {
        shopName: '',
        shopOwnerName: '',
        registrationNumber: '',
        contactNumber: '',
        city: '',
    };

    const validationSchema = Yup.object({
        shopName: Yup.string().required('Shop Name is required'),
        shopOwnerName: Yup.string().required('Shop Owner Name is required'),
        registrationNumber: Yup.string().required('Registration Number is required'),
        contactNumber: Yup.string()
            .matches(/^[0-9]+$/, 'Contact Number must be a number')
            .required('Contact Number is required'),
        city: Yup.string().required('City is required'),
    });

    const handleSubmit = async (values,{resetForm}) => {
        
        if (shopId) {
          const res =   await updateShopInfo({ id: shopId, updatedShopData: values }).unwrap();
          if(res.success){
           showSuccessAlert(res.message)
           resetForm()
          }else{
            showErrorAlert(res.message)
          }
        } else {
          console.log('create shop info')
           const res =  await createShopInfo(values).unwrap();
            if(res.success){
              showSuccessAlert(res.message)
              resetForm()
             }else{
               showErrorAlert(res.message)
             }
        }
        
    };


    return (
      <div className="container">
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
            {() => (
                <Form className="row">
                    <div className="col-md-6 mt-3">
                        <label>Shop Name</label>
                        <Field
                            type="text"
                            name="shopName"
                            className="form-control"
                        />
                        <ErrorMessage name="shopName" component="div" className="text-danger" />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label>Shop Owner Name</label>
                        <Field
                            type="text"
                            name="shopOwnerName"
                            className="form-control"
                        />
                        <ErrorMessage name="shopOwnerName" component="div" className="text-danger" />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label>Registration Number</label>
                        <Field
                            type="text"
                            name="registrationNumber"
                            className="form-control"
                        />
                        <ErrorMessage name="registrationNumber" component="div" className="text-danger" />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label>Contact Number</label>
                        <Field
                            type="text"
                            name="contactNumber"
                            className="form-control"
                        />
                        <ErrorMessage name="contactNumber" component="div" className="text-danger" />
                    </div>
                    <div className="col-md-6 mt-3">
                        <label>City</label>
                        <Field
                            type="text"
                            name="city"
                            className="form-control"
                        />
                        <ErrorMessage name="city" component="div" className="text-danger" />
                    </div>
                    <div className="col-12 d-flex justify-content-center">
                        <button type="submit" className="btn btn-sm btn-success my-4">
                            save
                        </button>
                    </div>
                </Form>
            )}
        </Formik>
      </div>
    );
};

export default Appsetting;
