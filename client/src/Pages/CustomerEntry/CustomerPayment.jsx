import React, { useEffect, useState } from "react";
import Layout from "../Layout/Layout";
import { useGetCustomerQuery } from "../../redux/Services/AddCustomerApi";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { Link, useParams } from "react-router-dom";
import {
  useAddCustomerPaymentMutation,
  useGetCustomerPaymentQuery,
  useDeleteCustomerPaymentMutation,
} from "../../redux/Services/CustomerPaymentApi";
import { showErrorAlert, showSuccessAlert } from "../../util/SweetalertHelper";
import * as yup from 'yup'
import { useNavigate } from "react-router-dom";

function CustomerPayment() {
  const { id} = useParams();
  const navigate = useNavigate()


  const [modalContent, setModalContent] = useState("");

  
  const { data: customerdata, refetch: refetchCustomer } =
    useGetCustomerQuery();
  const [AddCustomerPayment] = useAddCustomerPaymentMutation();
  const { data: CustomerPaymentData } = useGetCustomerPaymentQuery(id);
  const [DeleteCustomerPayment] = useDeleteCustomerPaymentMutation();




  const getAllCustomers = async (setFieldValue) => {
    const existingCustomer = customerdata?.FetchCustomer.find(
      (customer) => customer._id == id
    );
    setFieldValue("CustomerName", existingCustomer.CustomerName);
    setFieldValue("RemainingDues", existingCustomer.RemainingDues);
  };

  const handleModal = (value) => {
    setModalContent(value);
  };


  const handleClose = () => {
    setModalContent("");
  };

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const newvalue = { ...values, CustomerId: id };
      const res = await AddCustomerPayment(newvalue).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
        resetForm();
        refetchCustomer();
      }if(!res.success){
        showErrorAlert(res.message)
      }
    } catch (error) {
      const ErrorMessage = error.data?.message || 'An error Accured'
      showErrorAlert(ErrorMessage)
    }
  };

const handleDelete = async(PaymentId)=>{
 try {
const res = await DeleteCustomerPayment({PaymentId,id}).unwrap()
if(res.success){
  showSuccessAlert(res.message)
  refetchCustomer()
}
 } catch (error) {
  showErrorAlert(error)
 }
}

const handlePrint = (payment)=>{
  navigate('/customerentry/paymentprint',{
    state:{payment}
  })
}


const validationSchema = yup.object().shape({
  ReceiptAmount: yup.number().required('Receipt amount is required').min(0, 'Receipt amount must be a positive number'),
    Detail: yup.string().required('Detail is required'),
});
 
  return (
    <Layout>
      <div className="d-flex gap-3 py-4">
        <button
          type="button"
          className="btn btn-danger  ms-4 fw-bold btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#staticBackdrop"
          onClick={() => handleModal("CustomerPayment")}
        >
          Customer Payment
        </button>
        <Link
          to={`/customerentry/customerledger/${id}`}
          type="button"
          className="btn btn-primary  me-4 fw-bold btn-sm"
        >
          Customer Ledger
        </Link>
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
              <h5 className="modal-title text-center" id="staticBackdropLabel">
                {modalContent === "CustomerPayment" && "Customer Payment"}
                {modalContent === "CustomerLedger" && "Customer Ledger"}
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
                {modalContent === "CustomerPayment" && (
                  <>
                    <div className="col-md-12">
                      <Formik
                        enableReinitialize
                        initialValues={{
                          CustomerName: "",
                          RemainingDues: 0,
                          ReceiptAmount: 0,
                          Detail: "",
                          Date: new Date().toISOString().slice(0, 10),
                        }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                      >
                        {({ setFieldValue }) => {
                          useEffect(() => {
                            getAllCustomers(setFieldValue);
                          }, [id]);
                          return (
                            <Form className="row g-3">
                              <div className="col-md-6">
                                <label
                                  htmlFor="CustomerName"
                                  className="form-label"
                                >
                                  Customer Name
                                </label>
                                <Field
                                  name="CustomerName"
                                  type="text"
                                  className="form-control"
                                  id="CustomerName"
                                  disabled
                                />
                              </div>
                              <div className="col-md-6">
                                <label
                                  htmlFor="Remaining"
                                  className="form-label"
                                >
                                  Remaining Dues
                                </label>
                                <Field
                                  name="RemainingDues"
                                  type="number"
                                  className="form-control"
                                  id="RemainingDues"
                                  disabled
                                />
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <label
                                    htmlFor="ReceiptAmount"
                                    className="form-label"
                                  >
                                    Receipt of amount
                                  </label>
                                  <Field
                                    name="ReceiptAmount"
                                    type="number"
                                    className="form-control"
                                    id="ReceiptAmount"
                                  />
                                  <ErrorMessage
                                    name="ReceiptAmount"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <div className="col-md-6">
                                  <label
                                    htmlFor="Detail"
                                    className="form-label"
                                  >
                                    Detail
                                  </label>
                                  <Field
                                    name="Detail"
                                    as="textarea"
                                    className="form-control"
                                    id="Detail"
                                  />
                                  <ErrorMessage
                                    name="Detail"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-md-6">
                                  <label htmlFor="Date" className="form-label">
                                    Date
                                  </label>
                                  <Field
                                    name="Date"
                                    type="date"
                                    className="form-control"
                                    id="Date"
                                  />
                                  <ErrorMessage
                                    name="Date"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                              </div>

                              <div className="col-md-12 text-center">
                                <button
                                  type="submit"
                                  className="btn btn-success"
                                >
                                  Save
                                </button>
                              </div>
                            </Form>
                          );
                        }}
                      </Formik>
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
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h5 className="fw-bold my-3 text-center">Customer Payment List</h5>
        <div className="row my-5">
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>Customer Name</th>
                  <th>Date</th>
                  <th>Receipt Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {CustomerPaymentData?.FetchPayment.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                    <h6 className="text-center text-danger">No data available in the table</h6>
                    </td>
                  </tr>
                ) : (
                  CustomerPaymentData?.FetchPayment?.slice()
                    .reverse()
                    .map((payment, i) => {
                      return (
                        <tr key={payment._id}>
                          <td>{i + 1}</td>
                          <td>{payment.CustomerName}</td>
                          <td>{payment.Date}</td>
                          <td>{payment.ReceiptAmount}</td>
                          <td className="d-flex gap-2">
                            <button
                              className="btn btn-danger btn-sm"
                              aria-label={t("delete")}
                              onClick={() => handleDelete(payment._id)}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                            <button
                              className="btn btn-success btn-sm "
                              onClick={() => handlePrint(payment)}
                            >
                              <i className="fa-solid fa-print"></i>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default CustomerPayment;
