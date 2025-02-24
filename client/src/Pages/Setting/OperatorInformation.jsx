import React, { useState } from 'react';
import * as Yup from 'yup';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { useTranslation } from 'react-i18next';
import { useAddUserMutation,useGetAllUserQuery,useDeletUserMutation} from '../../redux/Services/AuthApi';
import {showErrorAlert,showSuccessAlert} from '../../util/SweetalertHelper'

function OperatorInformation() {
  const { t } = useTranslation();
  const [AddUserData] = useAddUserMutation()
  const [DeleteUserData] = useDeletUserMutation()
  const {data:AllUser} = useGetAllUserQuery()

console.log('AllUser',AllUser)
  const validationSchema = Yup.object({
    OperatorName: Yup.string().required(t('operatorNameRequired')),
    Password: Yup.string().required(t('passwordRequired')).min(3,'Password must be above to 3'),
    Role: Yup.string().required(t('roleRequired')),
    ContactNo: Yup.string()
      .required(t('contactNumberRequired'))
      .matches(/^[0-9]+$/, t('contactNumberInvalid')),
    Email: Yup.string()
      .required('Email Required').email('Please enter a valid email address')
  });

  const handleSubmit = async(values, { resetForm }) => {
    console.log(values)
    try {
      const res = await AddUserData(values).unwrap()
      if(res.success){
        showSuccessAlert(res.message)
        resetForm();
      }
      if(!res.success){
        showErrorAlert(res.message)
      }
      
    } catch (error) {
      showErrorAlert(`An error Occured ${error}`)
    }
  };
  const handleDeleteUser = async(id) => {
    try {
      const res = await DeleteUserData(id).unwrap()
      if(res.success){
        showSuccessAlert(res.message)
      }
      if(!res.success){
        showErrorAlert(res.message)
      }
      
    } catch (error) {
      showErrorAlert(`An error Occured ${error}`)
    }
  };


  return (
    <>
      <div className="col-lg-6">
        <Formik
          initialValues={{
            OperatorName: "",
            Password: "",
            Role: "",
            ContactNo: "",
            Email: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {() => (
            <Form className="row g-3">
              <div className="col-md-6">
                <label htmlFor="operatorName" className="form-label">
                  {t("operatorName")}
                </label>
                <Field
                  name="OperatorName"
                  type="text"
                  className=" form-control"
                  id="OperatorName"
                />
                <ErrorMessage
                  name="OperatorName"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="Email" className="form-label">
                  Email
                </label>
                <Field
                  name="Email"
                  type="email"
                  className=" form-control"
                  id="Email"
                />
                <ErrorMessage
                  name="Email"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="Password" className="form-label">
                  {t("password")}
                </label>
                <Field
                  name="Password"
                  type="password"
                  className="form-control"
                  id="Password"
                />
                <ErrorMessage
                  name="Password"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="ContactNo" className="form-label">
                  {t("contactNumber")}
                </label>
                <Field
                  name="ContactNo"
                  type="number"
                  className="form-control"
                  id="ContactNumber"
                />
                <ErrorMessage
                  name="ContactNo"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="Role" className="form-label">
                  {t("role")}
                </label>
                <Field
                  name="Role"
                  as="select"
                  className="form-control"
                  id="Role"
                >
                  <option value="">Select Role</option>
                  <option value="admin">Admin</option>
                  <option value="user">User</option>
                </Field>
                <ErrorMessage
                  name="Role"
                  component="div"
                  className="text-danger"
                />
              </div>
              <div className="row py-3">
                <div className="col-md-15 d-flex justify-content-center my-5">
                  <button
                    type="submit"
                    className="btn fw-bold btn-sm btn-outline-success"
                  >
                    Register
                  </button>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      <div className="col-lg-6">
        <h5 className="mt-3 mb-4 fw-bold text-center text-primary">
          User List
        </h5>
        <table className="table table-striped">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>{t("role")}</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {AllUser?.length == 0 ? (
              <tr>
                <td colSpan={5}>
                  <p className="text-danger text-center">Data Not Found</p>
                </td>
              </tr>
            ) : (
              AllUser?.slice()
                .reverse()
                .map((operator, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{operator.OperatorName}</td>
                    <td>{operator.Email}</td>
                    <td>{operator.ContactNo}</td>
                    <td>{operator.Role}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteUser(operator._id)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default OperatorInformation;
