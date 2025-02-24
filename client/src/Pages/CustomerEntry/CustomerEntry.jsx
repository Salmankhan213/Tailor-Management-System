import React, { useState } from "react";
import Layout from "../Layout/Layout";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useAddCustomerMutation, useDeleteCustomerMutation, useGetCustomerQuery } from "../../redux/Services/AddCustomerApi";
import {showSuccessAlert,showErrorAlert} from '../../util/SweetalertHelper'
function CustomerEntry() {
  const { t } = useTranslation();
  const [addCustomer] = useAddCustomerMutation()
  const {data:customerdata} = useGetCustomerQuery()
  const [deletecustomer] = useDeleteCustomerMutation()
  const [filterdata,setAFilterdata] = useState(null)


  // pagination Section
 const DisplaytoData = filterdata || customerdata?.FetchCustomer || []
  const [currentPage,setCurrentPage] = useState(1)
  const [rowPerPage,setRowPerPage] = useState(10)

  const LastIndexItem = currentPage * rowPerPage
  const FirstIndexItem = LastIndexItem - rowPerPage

   const CurrentItems = DisplaytoData.slice(FirstIndexItem,LastIndexItem)
   const totalPage =  Math.ceil(DisplaytoData.length / rowPerPage)


 const handlePrev = ()=>{
    setCurrentPage((prev)=> Math.max(prev-1 , 1))
 }
 const handleNext = ()=>{
  setCurrentPage((prev)=> Math.min(prev+1 , totalPage))

 }
 const handlePage = (pagenumber)=>{
  setCurrentPage(pagenumber)
 }

  const CustomerSchema = Yup.object({
    CustomerName: Yup.string().required(t('customerNameRequired')),
    PhoneNo: Yup.string().required(t('phoneNoRequired')),
    CnicNo: Yup.string().required(t('cnicNoRequired')),
    Profession: Yup.string().required(t('professionRequired')),
    Address: Yup.string().required(t('addressRequired')),
  });

  const handleSearch = (value) => {
    if(!value){
      setAFilterdata(null)
      return;
    }
    const filterdata = customerdata?.FetchCustomer.filter((item) =>
      item.CustomerName.toLowerCase().includes(value.toLowerCase())
    );
    setAFilterdata(filterdata)
  };
  const handleAddCustomer = async(values,{resetForm})=>{
    try {
      const newvalue = {
        ...values,
        RemainingDues:0,
      }
     const {success,message} =  await addCustomer(newvalue).unwrap()
     if(success){
       showSuccessAlert('Added Successfully!')
       resetForm()
     }else{
      showErrorAlert(message)
     }
    } catch (error) {
      showErrorAlert(error)
    }
  }
  const handleDeleteCustomer = async (id) => {
    try {
      const { success, message } = await deletecustomer(id).unwrap();
      success ? showSuccessAlert(message) : showErrorAlert(message);
    } catch (error) {
      showErrorAlert(error);
    }
  };

  return (
    <Layout>
      <h5 className="text-bold py-2 mt-3 text-center">
        {t("customerAndMeasurementEntry")}
      </h5>
      <div className="container">
        <div className="row mt-4 py-2">
          <div className="col-md-2 mb-2 mb-md-0">
            <button
              type="button"
              className="btn btn-success fw-bold"
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              <i className="fa-solid fa-plus"></i> {t("newCustomer")}
            </button>
          </div>
          <div className="col-md-3 col-6 d-flex gap-4  mt-2 mt-md-0 mb-md-0">
            <label htmlFor="Search" className="fw-bold">
              {t("search")}
            </label>
            <input
              type="text"
              className="form-control"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="col-md-2 col-6">
            <select name="rowpage" className='form-control w-25 bg-danger text-white' id="rowpage" onChange={(e)=>setRowPerPage( parseInt(e.target.value)) }>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>
        </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t("sNo")}</th>
                    <th>{t("customerName")}</th>
                    <th>{t("phoneNo")}</th>
                    <th>{t("cnic")}</th>
                    <th>{t("address")}</th>
                    <th>{t("profession")}</th>
                    <th>RemainingDues</th>
                    <th>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CurrentItems.slice()
                    .reverse()
                    .map((item, i) => {
                      return (
                        <tr key={item._id}>
                          <td>{i + 1}</td>
                          <td>{item.CustomerName}</td>
                          <td>{item.PhoneNo}</td>
                          <td>{item.CnicNo}</td>
                          <td>{item.Address}</td>
                          <td>{item.Profession}</td>
                          <td
                            className={`${
                              item.RemainingDues > 0
                                ? "text-danger fw-bold"
                                : "fw-bold"
                            }`}
                          >
                            {item.RemainingDues}
                          </td>
                          <td>
                            <div className="dropdown">
                              <button
                                className="btn btn-sm dropdown-toggle"
                                type="button"
                                id={`actionMenu${i}`}
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                <i className="fa-solid fa-ellipsis-vertical"></i>
                              </button>

                              <div
                                className="dropdown-menu"
                                aria-labelledby={`actionMenu${i}`}
                              >
                                <Link
                                  to={`/customerentry/payment/${item._id}`}
                                  className="dropdown-item text-primary"
                                >
                                  <i className="fa-regular fa-money-bill-1"></i>{" "}
                                  Payment
                                </Link>

                                <Link
                                  to={`/customerentry/orderform/${item._id}/${
                                    i + 1
                                  }`}
                                  className="dropdown-item text-primary"
                                >
                                  <i className="fa-solid fa-shirt"></i> Order
                                  Form
                                </Link>

                                <Link
                                  to={`/customerentry/measurement/${item._id}/${
                                    i + 1
                                  }`}
                                  className="dropdown-item text-warning"
                                >
                                  <i className="fa-solid fa-ruler-vertical"></i>{" "}
                                  Measurement
                                </Link>

                                <Link
                                  to={`/customerentry/update/${item._id}`}
                                  className="dropdown-item text-success"
                                >
                                  <i className="fa-solid fa-pen"></i> Update
                                </Link>
                                <button
                                  className="dropdown-item text-danger"
                                  onClick={() => handleDeleteCustomer(item._id)}
                                  aria-label="delete"
                                >
                                  <i className="fa-solid fa-trash"></i> Delete
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="row my-4">
            <div className="col-md-12 d-flex justify-content-center">
              <button
                className="btn  btn-sm btn-danger me-1 fw-bold"
                onClick={handlePrev}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              {Array.from({ length: totalPage }, (_, ind) => (
                <button
                  className={`btn btn-sm  mx-2 ${
                    currentPage === ind + 1 ? "btn-danger" : "btn-primary"
                  }`}
                  onClick={()=>handlePage(ind+1)}
                  key={ind + 1}
                >
                  {ind + 1}
                </button>
              ))}
              <button
                className="btn  btn-sm btn-danger ms-1 fw-bold"
                onClick={handleNext}
                disabled={currentPage === totalPage}
              >
                Next
              </button>
            </div>
          </div>
        </div>
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
                {t("addNewCustomer")}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label={t("close")}
              ></button>
            </div>
            <div className="modal-body py-4">
              <Formik
                initialValues={{
                  CustomerName: "",
                  PhoneNo: "",
                  CnicNo: "",
                  Profession: "",
                  Address: "",
                }}
                validationSchema={CustomerSchema}
                onSubmit={handleAddCustomer}
              >
                {() => (
                  <Form className="row g-3">
                    <div className="col-md-6">
                      <label
                        htmlFor="CustomerName"
                        className="form-label fw-bold"
                      >
                        {t("customerName")}
                      </label>
                      <Field
                        name="CustomerName"
                        type="text"
                        className="form-control"
                        id="CustomerName"
                      />
                      <ErrorMessage
                        name="CustomerName"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="PhoneNo" className="form-label fw-bold">
                        {t("phoneNo")}
                      </label>
                      <Field
                        name="PhoneNo"
                        type="text"
                        className="form-control"
                        id="PhoneNo"
                      />
                      <ErrorMessage
                        name="PhoneNo"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="CnicNo" className="form-label fw-bold">
                        {t("cnic")}
                      </label>
                      <Field
                        name="CnicNo"
                        type="text"
                        className="form-control"
                        id="CnicNo"
                      />
                      <ErrorMessage
                        name="CnicNo"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="Address" className="form-label fw-bold">
                        {t("address")}
                      </label>
                      <Field
                        name="Address"
                        as="textarea"
                        className="form-control"
                        id="Address"
                      />
                      <ErrorMessage
                        name="Address"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label
                        htmlFor="Profession"
                        className="form-label fw-bold"
                      >
                        {t("profession")}
                      </label>
                      <Field
                        name="Profession"
                        type="text"
                        className="form-control"
                        id="Profession"
                      />
                      <ErrorMessage
                        name="Profession"
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
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
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

export default CustomerEntry;
