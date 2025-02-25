import React, { useEffect } from 'react'
import Layout from '../Layout/Layout'
import * as Yup  from 'yup'
import { Formik, Field, Form, ErrorMessage,} from "formik";
import {useGetWorkerQuery, useUpdateWorkerMutation} from '../../redux/Services/AddWorkerApi'
import { useNavigate, useParams } from 'react-router-dom';
import { showErrorAlert, showSuccessAlert } from '../../util/SweetalertHelper';

function UpdateWorker() {
const navigate = useNavigate()
const {data:Workerdata} = useGetWorkerQuery()
const [WorkerUpdating] = useUpdateWorkerMutation()

const {id} = useParams()
const WorkerSchema = Yup.object({
        WorkerName: Yup.string().required('Worker Name is Required'),
        PhoneNo: Yup.string().required('Phone No is required'),
        CnicNo: Yup.string().required('CNIC is required'),
        Address: Yup.string().required('Address is required'),
      });

const GetWokerData = (setValues)=>{
        const findWorker =  Workerdata?.FetchWorker?.find((worker,i) => worker._id == id )
        setValues(findWorker)
}

const handleUpdateWorker = async(values)=>{
try {
const res = await WorkerUpdating({id,values}).unwrap()
if(res.success){
    showSuccessAlert(res.message) 
    navigate('/workerentry')
}
if(!res.success){
    showErrorAlert(res.message) 
}
} catch (error) {
    showErrorAlert(error)
}
}
  return (
    <>
    <Layout>
  <div className="container my-5">
    <div className="row">
        <div className="col-md-12">
        <Formik
        initialValues={{
                  WorkerName: "",
                  PhoneNo: "",
                  CnicNo: "",
                  Address: "",
                }}
                validationSchema={WorkerSchema}
                onSubmit={handleUpdateWorker}
              >
                {({setValues}) =>{
                    useEffect(()=>{
                        GetWokerData(setValues)
                    },[id,Workerdata])
                    return (
                        <Form className="row g-3">
                        <div className="col-md-6">
                          <label
                            htmlFor="WorkerName"
                            className="form-label fw-bold"
                          >
                            Worker Name
                          </label>
                          <Field
                            name="WorkerName"
                            type="text"
                            className="form-control"
                            id="WorkerName"
                          />
                          <ErrorMessage
                            name="WorkerName"
                            component="div"
                            className="text-danger"
                          />
                        </div>
                        <div className="col-md-6">
                          <label htmlFor="PhoneNo" className="form-label fw-bold">
                          Phone No
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
                            CNIC
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
                            Address
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
                        <div className="col-md-12 text-center my-4">
                          <button type="submit" className="btn btn-success">
                            Update & Save
                          </button>
                        </div>
                      </Form>
                    )
                }}
              </Formik>
        </div>
    </div>
  </div>
    </Layout>
    </>
  )
}

export default UpdateWorker
