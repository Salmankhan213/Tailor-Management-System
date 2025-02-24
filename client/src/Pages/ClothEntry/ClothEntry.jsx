import React, { useEffect, useState } from 'react';
import Layout from '../Layout/Layout';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAddStitchingCategoryMutation, useDeleteStitchingCategoryMutation, useGetStitchingCategoryQuery,useUpdateStitchingCategoryMutation } from '../../redux/Services/StitchingCategoryApi';
import { useAddStitchingMeasurementMutation,useDeleteStitchingMeasurementMutation,useGetStitchingMeasurementQuery, useUpdateStitchingMeasurementMutation } from '../../redux/Services/StitchingMeasurementApi';
import {showErrorAlert, showSuccessAlert} from '../../util/SweetalertHelper'
import { useAddStitchingDesignMutation, useDeleteStitchingDesignMutation, useGetStitchingDesignQuery, useUpdateStitchingDesignMutation } from '../../redux/Services/StitchingDesign';
import axios from 'axios';

function ClothEntry() {
  const { t } = useTranslation();
  // Stitching  global
       const [selectedCategory, setSelectedCategory] = useState(null);
      const [selectedStitchingDetail, setSelectedStitchingDetail] = useState(null);
      const [editMode, setEditMode] = useState(false);
      const [filteredMeasurements, setFilteredMeasurements] = useState([]);
      console.log(selectedCategory);
    
      const handleClose = () => {
        setSelectedCategory(null);
        setEditMode(false);
      };
    
      const handleEditCategory = (category, stitchingDetail, ind) => {
        if (selectedCategory && selectedCategory._id === category._id) {
          setSelectedCategory(null);
          setSelectedStitchingDetail("");
          setEditMode(false);
        } else {
          setSelectedCategory({ ...category, ind });
          setSelectedStitchingDetail(stitchingDetail);
          setEditMode(true);
        }
      };
    
      const [modalContent, setModalContent] = useState('');
    
      const handleModal = (val) => {
        setModalContent(val);
      };

     
 

  // Stitching Category Validation Schema
  const StitchingSchema = Yup.object().shape({
  TypeStitchingName: Yup.string()
    .required('Type of Stitching Name is required')
    .min(2, 'Type of Stitching Name must be at least 2 characters')
    .max(50, 'Type of Stitching Name cannot exceed 50 characters'),
  Image: Yup.mixed(),
  SingleStitching: Yup.number()
    .typeError('Single Stitching must be a number')
    .required('Single Stitching is required')
    .min(0, 'Double Stitching must be equal to or above zero'),
  
  DoubleStitching: Yup.number()
    .typeError('Double Stitching must be a number')
    .required('Double Stitching is required')
    .min(0, 'Double Stitching must be equal to or above zero'),
});

// Measurement Details Validation Schema
 const MeasurementDetailSchema = Yup.object().shape({
  TypeStitchingName: Yup.string()
    .required('Type of Stitching Name is required')
    .min(2, 'Type of Stitching Name must be at least 2 characters')
    .max(30, 'Type of Stitching Name cannot exceed 50 characters'),
  
  StitchingDetial: Yup.string()
    .required('Stitching Detail is required')
    .min(2, 'Stitching Detail must be at least 5 characters')
    .max(30, 'Stitching Detail cannot exceed 200 characters'),
});

// Design Entry Validation Schema
 const DesignSchema = Yup.object().shape({
  DesignName: Yup.string()
    .required('Design Name is required')
    .min(2, 'Design Name must be at least 2 characters')
    .max(100, 'Design Name cannot exceed 100 characters'),
  Image: Yup.mixed()
});

  // Stitching Category Api
  const [addcatgegory] = useAddStitchingCategoryMutation()
  const {data:StitchingCategory} = useGetStitchingCategoryQuery()
  const [deletecategory] = useDeleteStitchingCategoryMutation()
  const [updatecategory] = useUpdateStitchingCategoryMutation()

  const SubmitCategory = (values,{resetForm})=>{
    if(editMode){
     handleCategoryUpdate(selectedCategory._id,values,resetForm)
    }else{
      handleStitchingCategory(values,resetForm)
    }
   }
    const handleStitchingCategory = async(values ,resetForm)=>{
       try {
        await addcatgegory(values).unwrap()
        resetForm()
        showSuccessAlert('Added Successfully!')
       } catch (error) {
        showErrorAlert(error)
       }
        
    }
    const handleCategoryUpdate = async(id,values ,resetForm)=>{
       try {
        await updatecategory({id,values}).unwrap()
        showSuccessAlert('Updated Successfully!')
        setSelectedCategory(null)
        setEditMode(false)
       } catch (error) {
        showErrorAlert(error)
       }
        
    }
  
  
    const handleCategoryDelete = async(id)=>{
      try {
        await deletecategory(id).unwrap()
        showSuccessAlert('Deleted Successfully!')
      } catch (error) {
        showErrorAlert(error)
      }
    }
  


  // Stitching Measurement Api
  const [addMeasurement] = useAddStitchingMeasurementMutation();
  const { data: Measurementdata,refetch } = useGetStitchingMeasurementQuery();
  const [deleteMeasurement] = useDeleteStitchingMeasurementMutation();
  const [updateMeasurement] = useUpdateStitchingMeasurementMutation();

  useEffect(() => {
    if (Measurementdata && Measurementdata.FetchMeasurement) {
      setFilteredMeasurements(Measurementdata.FetchMeasurement);
    }
  }, [Measurementdata]);

  const SubmitMeasurement = async (values, { resetForm }) => {
    if (editMode) {
      await handleUpdateMeasurement(selectedCategory._id, selectedCategory.ind, values, resetForm);
    } else {
      await handleAddMeasurement(values, resetForm);
    }
  };

  const handleUpdateMeasurement = async (id, ind, values, resetForm) => {
    console.log(values);
    try {
      const response = await updateMeasurement({ id, ind, StitchingDetial: values.StitchingDetial }).unwrap();
      if (response.success) {
        showSuccessAlert(response.message);
        refetch()
        resetForm();
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const handleAddMeasurement = async (values, resetForm) => {
    try {
      const response = await addMeasurement(values).unwrap();
      if (response.success) {
        showSuccessAlert(response.message);
        resetForm();
        refetch()
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const handleDeleteMeasurement = async (id, ind) => {
    try {
      const response = await deleteMeasurement({ id, ind }).unwrap();
      if (response.success) {
        showSuccessAlert(response.message);
        refetch()
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };
  const handleStitchingChange = (event, setFieldValue) => {
    const selectedTypeId = event.target.value;
  
    if (selectedTypeId === "") {
      setFilteredMeasurements([]);
      setFieldValue("TypeStitchingName", "");
    } else {
      setFieldValue("TypeStitchingName", selectedTypeId);
  
      const filtered = Measurementdata?.FetchMeasurement?.filter((item) =>
        item.TypeStitchingId._id === selectedTypeId
      );
  
      setFilteredMeasurements(filtered);
    }
  };

   // Stitching Design
   const [addDesign] = useAddStitchingDesignMutation()
   const {data:Designdata} = useGetStitchingDesignQuery()
   const [deleteDesign] = useDeleteStitchingDesignMutation()
   const [updateDesign] = useUpdateStitchingDesignMutation()

   const SubmitAddDesign = (values,{resetForm})=>{
    if(editMode){
      handleUpdateDesign(selectedCategory._id,values,resetForm)
    }else{
      handleAddDesign(values,resetForm)
    }
   }

   const handleUpdateDesign = async(id,values,resetForm)=>{
    try {
      await updateDesign({id,values}).unwrap()
      showSuccessAlert('Updated Success')
      resetForm()
    } catch (error) {
      showErrorAlert(error)
    }
   }

   const handleAddDesign = async(values,resetForm)=>{
    try {
      await addDesign(values).unwrap()
      showSuccessAlert('Added Successfully!')
      resetForm()
    } catch (error) {
      showErrorAlert(error)
    }
   }


   const handleDesignDelete = async(id)=>{
    try {
      await deleteDesign(id).unwrap()
      showSuccessAlert('Deleted Successfully!')
    } catch (error) {
      showErrorAlert(error)
    }
   }

 

  return (
    <Layout>
      <div className="d-flex gap-2 py-4">
        <button
          type="button"
          className="btn btn-danger py-2 fw-bold"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={() => handleModal("StitchingCategoryEntry")}
        >
          Stitching Category
        </button>
        <button
          type="button"
          className="btn btn-success py-2 fw-bold"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={() => handleModal("MeasurementDetailsEntry")}
        >
          Measurement Detail
        </button>
        <button
          type="button"
          className="btn btn-primary py-2 px-5 fw-bold"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={() => handleModal("DesignEntry")}
        >
          Design
        </button>
      </div>

      <div
        className="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content px-2">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                {modalContent === "StitchingCategoryEntry" &&
                  t("stitchingCategoryEntry")}
                {modalContent === "MeasurementDetailsEntry" &&
                  t("measurementDetailsEntry")}
                {modalContent === "DesignEntry" && t("designEntry")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleClose}
              ></button>
            </div>
            <div className="modal-body py-4">
              <div className="row">
                {modalContent === "StitchingCategoryEntry" && (
                  <>
                    <div className="col-md-6">
                      <Formik
                        enableReinitialize
                        initialValues={{
                          TypeStitchingName: selectedCategory
                            ? selectedCategory.TypeStitchingName
                            : "",
                          Image: selectedCategory ? selectedCategory.Image : "",
                          SingleStitching: selectedCategory
                            ? selectedCategory.SingleStitching
                            : 0,
                          DoubleStitching: selectedCategory
                            ? selectedCategory.DoubleStitching
                            : 0,
                        }}
                        validationSchema={StitchingSchema}
                        onSubmit={SubmitCategory}
                      >
                        {() => (
                          <Form className="row g-3">
                            <div className="col-md-12">
                              <label
                                htmlFor="TypeStitchingName"
                                className="form-label"
                              >
                                {t("typeOfStitchingName")}
                              </label>
                              <Field
                                name="TypeStitchingName"
                                type="text"
                                className="form-control"
                                id="TypeStitchingName"
                              />
                              <ErrorMessage
                                name="TypeStitchingName"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12">
                              <label htmlFor="Image" className="form-label">
                                {t("image")}
                              </label>
                              <Field
                                name="Image"
                                type="file"
                                className="form-control"
                                id="Image"
                              />
                              <ErrorMessage
                                name="Image"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12">
                              <label
                                htmlFor="SingleStitching"
                                className="form-label"
                              >
                                {t("singleStitching")}
                              </label>
                              <Field
                                name="SingleStitching"
                                type="number"
                                className="form-control"
                                id="SingleStitching"
                              />
                              <ErrorMessage
                                name="SingleStitching"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12">
                              <label
                                htmlFor="DoubleStitching"
                                className="form-label"
                              >
                                {t("doubleStitching")}
                              </label>
                              <Field
                                name="DoubleStitching"
                                type="number"
                                className="form-control"
                                id="DoubleStitching"
                              />
                              <ErrorMessage
                                name="DoubleStitching"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12 text-center">
                              <button type="submit" className="btn btn-success">
                                {t("save")}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="col-md-6">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>{t("sNo")}</th>
                            <th>{t("stitchingType")}</th>
                            <th>{t("action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {StitchingCategory.FetchCategory.length > 0 ? (
                            StitchingCategory.FetchCategory?.map((item, i) => {
                              return (
                                <tr key={i}>
                                  <td>{i + 1}</td>
                                  <td>{item.TypeStitchingName}</td>
                                  <td className="d-flex gap-2 flex-column flex-md-row">
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => handleEditCategory(item)}
                                    >
                                      <i class="fa-solid fa-pen"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() =>
                                        handleCategoryDelete(item._id)
                                      }
                                    >
                                      <i class="fa-solid fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          ) : (
                            <tr>
                              <td colSpan={3}>
                                <p className="text-danger text-center">
                               
                                  No Data Found
                                </p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {modalContent === "MeasurementDetailsEntry" && (
                  <>
                    <div className="col-md-6">
                      <Formik
                        enableReinitialize
                        initialValues={{
                          TypeStitchingName: selectedCategory
                            ? selectedCategory.TypeStitchingId.TypeStitchingName
                            : "",
                          StitchingDetial: selectedStitchingDetail
                            ? selectedStitchingDetail
                            : "",
                        }}
                        validationSchema={MeasurementDetailSchema}
                        onSubmit={SubmitMeasurement}
                      >
                        {({ setFieldValue }) => {
                          return (
                            <Form className="row g-3">
                              <div className="col-md-12">
                                <label
                                  htmlFor="TypeStitchingName"
                                  className="form-label"
                                >
                                  {t("typeOfStitchingName")}
                                </label>
                                <Field
                                  as="select"
                                  name="TypeStitchingName"
                                  className="form-control"
                                  id="TypeStitchingName"
                                  onChange={(event) =>
                                    handleStitchingChange(event, setFieldValue)
                                  }
                                >
                                  <option value="">
                                    {selectedCategory
                                      ? selectedCategory.TypeStitchingId
                                          .TypeStitchingName
                                      : t("selectCategory")}
                                  </option>
                                  {StitchingCategory &&
                                    StitchingCategory.FetchCategory?.map(
                                      (category) => (
                                        <option
                                          key={category._id}
                                          value={category._id}
                                        >
                                          {category.TypeStitchingName}
                                        </option>
                                      )
                                    )}
                                </Field>
                                <ErrorMessage
                                  name="TypeStitchingName"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-md-12">
                                <label
                                  htmlFor="StitchingDetial"
                                  className="form-label"
                                >
                                  {t("stitchingDetail")}
                                </label>
                                <Field
                                  name="StitchingDetial"
                                  type="text"
                                  className="form-control"
                                  id="StitchingDetial"
                                />
                                <ErrorMessage
                                  name="StitchingDetial"
                                  component="div"
                                  className="text-danger"
                                />
                              </div>
                              <div className="col-md-12 text-center">
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  {t("save")}
                                </button>
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
                    </div>

                    <div className="col-md-6">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>{t("sNo")}</th>
                            <th>{t("stitchingDetail")}</th>
                            <th>{t("action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredMeasurements &&
                          filteredMeasurements.length > 0 ? (
                            filteredMeasurements
                              .slice()
                              .reverse()
                              .map((item, i) =>
                                item.StitchingDetial?.slice()
                                  .reverse()
                                  .map((MDetial, ind) => (
                                    <tr key={`${i}-${ind}`}>
                                      <td>{ind + 1}</td>
                                      <td>{MDetial}</td>
                                      <td className="d-flex gap-2 flex-column flex-md-row">
                                        <button
                                          className="btn btn-sm btn-success"
                                          onClick={() =>
                                            handleEditCategory(
                                              item,
                                              MDetial,
                                              ind
                                            )
                                          } // Pass MDetial to edit
                                        >
                                          <i className="fa-solid fa-pen"></i>
                                        </button>
                                        <button
                                          className="btn btn-sm btn-danger"
                                          onClick={() =>
                                            handleDeleteMeasurement(
                                              item._id,
                                              ind
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-trash"></i>
                                        </button>
                                      </td>
                                    </tr>
                                  ))
                              )
                          ) : (
                            <tr>
                              <td colSpan="3">
                                <p className='text-danger text-center'>No Data Found</p>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}

                {modalContent === "DesignEntry" && (
                  <>
                    <div className="col-md-6">
                      <Formik
                        enableReinitialize
                        initialValues={{
                          DesignName: selectedCategory
                            ? selectedCategory.DesignName
                            : "",
                          Image: selectedCategory ? selectedCategory.Image : "",
                        }}
                        validationSchema={DesignSchema}
                        onSubmit={SubmitAddDesign}
                      >
                        {() => (
                          <Form className="row g-3">
                            <div className="col-md-12">
                              <label
                                htmlFor="DesignName"
                                className="form-label"
                              >
                                {t("designName")}
                              </label>
                              <Field
                                name="DesignName"
                                type="text"
                                className="form-control"
                                id="DesignName"
                              />
                              <ErrorMessage
                                name="DesignName"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12">
                              <label htmlFor="Image" className="form-label">
                                {t("image")}
                              </label>
                              <Field
                                name="Image"
                                type="file"
                                className="form-control"
                                id="Image"
                              />
                              <ErrorMessage
                                name="Image"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-md-12 text-center">
                              <button type="submit" className="btn btn-success">
                                {t("save")}
                              </button>
                            </div>
                          </Form>
                        )}
                      </Formik>
                    </div>
                    <div className="col-md-6">
                      <table className="table table-striped">
                        <thead>
                          <tr>
                            <th>{t("sNo")}</th>
                            <th>{t("designName")}</th>
                            <th>{t("action")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Designdata &&
                            Designdata.FetchDesign?.slice()
                              .reverse()
                              .map((item, i) => {
                                return (
                                  <tr key={item._id}>
                                    <td>{i + 1}</td>
                                    <td>{item.DesignName}</td>
                                    <td className="d-flex gap-2 flex-column flex-md-row">
                                      <button
                                        className="btn btn-sm btn-success"
                                        onClick={() => handleEditCategory(item)}
                                      >
                                        <i class="fa-solid fa-pen"></i>
                                      </button>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleDesignDelete(item._id)
                                        }
                                      >
                                        <i class="fa-solid fa-trash"></i>
                                      </button>
                                    </td>
                                  </tr>
                                );
                              })}
                        </tbody>
                      </table>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                onClick={() => handleClose()}
              >
                {t("close")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default ClothEntry;
