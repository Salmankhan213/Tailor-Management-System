import React from 'react';
import { Formik, Field, ErrorMessage, Form } from 'formik';
import * as Yup from 'yup';
import { useLoginMutation } from '../redux/Services/AuthApi';
import { showSuccessAlert, showErrorAlert } from '../util/SweetalertHelper';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShowPrint } from '../redux/Services/Features/PrintSlice';
import './Login.css'

function Login() {
  const [UserLogindata] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (values) => {
    try {
      const res = await UserLogindata(values).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
        setTimeout(() => {
          dispatch(ShowPrint(false));
          navigate('/');
        }, 1000);
      }
      if (!res.success) {
        showErrorAlert(res.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  return (
    <>
      <div className="container-fluid ">
        <div className="row vh-100 bg-light d-flex align-items-center justify-content-center Login-Top">
          <div className="col-md-3 col-6 bg-gray-100 shadow rounded py-3 mx-5  px-3 Login-inner">
            <div className="d-flex mb-4">
              <img src="/public/images/tailorIcon.jpeg" width="50px" height="50px" className="rounded-5 mx-auto" alt="" />
            </div>
            <h3 className="text-center text-dark mb-5 text-white">MP Tailor</h3>
            <Formik
              initialValues={{
                Email: '',
                Password: '',
              }}
              validationSchema={Yup.object({
                Email: Yup.string().email('Invalid email format').required('Email Required'),
                Password: Yup.string().min(5, 'Password must be at least 5 characters').required('Password Required'),
              })}
              onSubmit={handleLogin}
            >
              {() => (
                <Form>
                  <div className="mb-lg-4 mb-3">
                    <label htmlFor="Email" className="form-label">
                      Email
                    </label>
                    <Field
                      name="Email"
                      id="Email"
                      type="email"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="Email"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>
                  <div className="mb-lg-5 mb-3">
                    <label htmlFor="Password" className="form-label">
                      Password
                    </label>
                    <Field
                      name="Password"
                      id="Password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="Password"
                      component="div"
                      className="text-danger small mt-1"
                    />
                  </div>
                  <div className="d-flex justify-content-center align-items-center">
                    <button type="submit" className="success-button w-lg-25 w-md-50 mt-3">
                      Log In
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
