import React from "react";
import * as Yup  from 'yup'
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next'
import Layout from "../Layout/Layout";
import {useGetWorkerQuery} from '../../redux/Services/AddWorkerApi'
import { useAddWorkerAccountMutation ,useGetWorkerAccountQuery,useDeleteWorkerAccountMutation} from "../../redux/Services/WorkerAccountBookApi";
import {showErrorAlert,showSuccessAlert} from '../../util/SweetalertHelper'

function WorkerAccountBook() {
    const {t} = useTranslation()
    const {data:WorkerData,refetch:WorkerRefetch} = useGetWorkerQuery()
    const [WorkerAccountAdding] = useAddWorkerAccountMutation()
    const {data:workerAccountdata} = useGetWorkerAccountQuery()
    const [WorkerAccountDeleting] = useDeleteWorkerAccountMutation()

    const WorkerSchema = Yup.object({
        Date: Yup.string().required('Date Required'),
        WorkerId: Yup.string().required('Worker  Name Required'),
        Action: Yup.string().required('Action Required'),
        Money: Yup.number().required('Money is required'),
        Detail: Yup.string().required('Detail Required'),
      });
const handleAddWorkerAccount = async(values,{resetForm})=>{
  console.log(values)
  try {
    const res = await WorkerAccountAdding(values).unwrap()
    console.log('res',res)
    if(res.success){
      showSuccessAlert(res.message)
      resetForm()
      WorkerRefetch()
    }
    if(!res.success){
      showErrorAlert(res.message)
    }
  } catch (error) {
    showErrorAlert(error)
  }
}
      
const HanleDeleteWorker  = async(id,workerId)=>{
try {
  const res = await WorkerAccountDeleting({id,workerId}).unwrap()
  if(res.success){
    showSuccessAlert(res.message)
    WorkerRefetch()
  }
  else if(!res.success){
    showErrorAlert(res.message)
  }
} catch (error) {
  showErrorAlert(error)
}
}


  return (
    <Layout>



        <div className="container">
            <div className="row">
            <Formik
                initialValues={{
                  Date:'',
                  WorkerId: "",
                  Action: "",
                  Money: 0,
                  Detail: "",
                }}
                validationSchema={WorkerSchema}
                onSubmit={handleAddWorkerAccount}
              >
                {() => (
                  <Form className="row g-3">
                    <div className="col-md-3">
                      <label
                        htmlFor="Date"
                        className="form-label fw-bold"
                      >
                        Date
                      </label>
                      <Field
                        name="Date"
                        type="Date"
                        className="form-control"
                        id="Date"
                      />
                      <ErrorMessage
                        name="Date"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-3">
                      <label
                        htmlFor="WorkerId"
                        className="form-label fw-bold"
                      >
                        Worker Name
                      </label>
                      <Field
                        name="WorkerId"
                        as="select"
                        className="form-control"
                        id="WorkerId"
                      >
                      <option value=''>Select Customer</option>
                      {WorkerData?.FetchWorker?.map((worker,i)=>{
                        return (
                       <option value={worker._id} key={i}>{worker.WorkerName}</option>
                        )
                      })}
                      
                      </Field>
                      <ErrorMessage
                        name="WorkerId"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="Action" className="form-label fw-bold">
                        Action
                      </label>
                      <Field name="Action" as="select" className="form-control">
                       <option value="">Select Action</option>
                       <option value="Salary">Salary</option>
                       <option value="Loan">Loan</option>
                       <option value="Work">Work</option>
                      </Field>
                      <ErrorMessage
                        name="Action"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-3">
                      <label htmlFor="Money" className="form-label fw-bold">
                        Money
                      </label>
                      <Field
                        name="Money"
                        type="number"
                        className="form-control"
                        id="Money"
                      />
                      <ErrorMessage
                        name="Money"
                        component="div"
                        className="text-danger"
                      />
                    </div>
                    <div className="col-md-6">
                      <label htmlFor="Detail" className="form-label fw-bold">
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
                    <div className="col-md-12 text-center">
                      <button type="submit" className="btn btn-success">
                        {t("save")}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>


                    <div className="row mt-5">
          <div className="col-md-12">
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>{t("sNo")}</th>
                    <th>Date</th>
                    <th>Worker Name</th>
                    <th>Action</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Detail</th>
                    <th>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {workerAccountdata?.FetchWorkerAccount?.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <h5 className="text-danger  text-center py-3">
                          Data not found
                        </h5>
                      </td>
                    </tr>
                  ) : (
                    workerAccountdata?.FetchWorkerAccount?.slice()
                      .reverse()
                      .map((workeraccount, i) => (
                          <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{workeraccount.Date}</td>
                          <td>{workeraccount.WorkerId.WorkerName}</td>
                          <td>{workeraccount.Action}</td>
                          <td className="text-danger fw-bold">{workeraccount.Debit}</td>
                          <td className="text-primary fw-bold">{workeraccount.Credit}</td>
                          <td>{workeraccount.Detail}</td>
                          <td className="d-flex gap-2 flex-column flex-md-row">
                            <button
                              className="btn btn-sm btn-danger"
                              aria-label={t("delete")}
                              onClick={() => HanleDeleteWorker(workeraccount._id,workeraccount.WorkerId._id)}
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
          </div>
        </div>
        </div>

    </Layout>
  );
}

export default WorkerAccountBook;
