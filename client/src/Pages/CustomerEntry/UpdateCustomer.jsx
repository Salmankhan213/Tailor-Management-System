import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  useGetCustomerQuery,
  useUpdateCustomerMutation,
} from "../../redux/Services/AddCustomerApi";
import { showErrorAlert, showSuccessAlert } from "../../util/SweetalertHelper";
import Layout from "../Layout/Layout";

function UpdateCustomer() {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { data: Customerdata } = useGetCustomerQuery();
  const [UpdateCustomerData] = useUpdateCustomerMutation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ur" ? "rtl" : "ltr";
  }, [i18n.language]);

  const UpdateCustomerSchema = Yup.object({
    CustomerName: Yup.string().required(t("customerNameRequired")),
    PhoneNo: Yup.string().required(t("phoneNoRequired")),
    CnicNo: Yup.string().required(t("cnicNoRequired")),
    Profession: Yup.string().required(t("professionRequired")),
    Address: Yup.string().required(t("addressRequired")),
  });
  const handleUpdateCustomer = async (values) => {
    try {
      const { success, message } = await UpdateCustomerData({
        id,
        values,
      }).unwrap();
      if (success) {
        showSuccessAlert(message);
        navigate("/customerentry");
      } else {
        showErrorAlert(message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };
  const getCustomer = async (setValues) => {
    try {
      const findOneCustomr = Customerdata?.FetchCustomer?.find(
        (cust) => cust._id == id
      );
      setValues(findOneCustomr);
    } catch (error) {
      showErrorAlert(error);
    }
  };
  return (
    <Layout>
      <div
        className="container my-5"
        dir={i18n.language === "ur" ? "rtl" : "ltr"}
      >
        <div className="row">
          <div className="col-md-12">
            <Formik
              initialValues={{
                CustomerName: "",
                PhoneNo: "",
                CnicNo: "",
                Profession: "",
                Address: "",
              }}
              validationSchema={UpdateCustomerSchema}
              onSubmit={handleUpdateCustomer}
            >
              {({ setValues }) => {
                useEffect(() => {
                  getCustomer(setValues);
                }, [id]);
                return (
                  <Form className="row g-3">
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                    <div className="col-md-4">
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
                        Update
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default UpdateCustomer;
