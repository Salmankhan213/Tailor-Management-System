import React from "react";
import * as Yup from "yup";
import { Formik, Field, Form, ErrorMessage } from "formik";
import Select from "react-select";
import Layout from "../Layout/Layout";
import { useGetWorkerQuery } from "../../redux/Services/AddWorkerApi";
import {
  useAddWorkerAccountMutation,
  useGetWorkerAccountQuery,
  useDeleteWorkerAccountMutation,
} from "../../redux/Services/WorkerAccountBookApi";
import { showErrorAlert, showSuccessAlert } from "../../util/SweetalertHelper";

function WorkerAccountBook() {
  const { data: WorkerData, refetch: WorkerRefetch } = useGetWorkerQuery();
  const [WorkerAccountAdding] = useAddWorkerAccountMutation();
  const { data: workerAccountdata } = useGetWorkerAccountQuery();
  const [WorkerAccountDeleting] = useDeleteWorkerAccountMutation();

  const WorkerSchema = Yup.object({
    Date: Yup.string().required("Date Required"),
    WorkerId: Yup.string().required("Worker Name Required"),
    Action: Yup.string().required("Action Required"),
    Money: Yup.number().required("Money is required"),
    Detail: Yup.string().required("Detail Required"),
  });

  const handleAddWorkerAccount = async (values, { resetForm }) => {
    try {
      const res = await WorkerAccountAdding(values).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
        resetForm();
        WorkerRefetch();
      }
      if (!res.success) {
        showErrorAlert(res.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  const handleDeleteWorker = async (id, workerId) => {
    try {
      const res = await WorkerAccountDeleting({ id, workerId }).unwrap();
      if (res.success) {
        showSuccessAlert(res.message);
        WorkerRefetch();
      } else if (!res.success) {
        showErrorAlert(res.message);
      }
    } catch (error) {
      showErrorAlert(error);
    }
  };

  // Options for react-select
  const workerOptions = WorkerData?.FetchWorker?.map((worker) => ({
    value: worker._id,
    label: worker.WorkerName,
  })) || [];

  const actionOptions = [
    { value: "Salary", label: "Salary" },
    { value: "Loan", label: "Loan" },
    { value: "Work", label: "Work" },
  ];

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <Formik
            initialValues={{
              Date: "",
              WorkerId: "",
              Action: "",
              Money: 0,
              Detail: "",
            }}
            validationSchema={WorkerSchema}
            onSubmit={handleAddWorkerAccount}
          >
            {({ setFieldValue }) => (
              <Form className="row g-3">
                <div className="col-md-3">
                  <label htmlFor="Date" className="form-label fw-bold">
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
                  <label htmlFor="WorkerId" className="form-label fw-bold">
                    Worker Name
                  </label>
                  <Select
                    name="WorkerId"
                    options={workerOptions}
                    onChange={(selectedOption) =>
                      setFieldValue("WorkerId", selectedOption.value)
                    }
                    placeholder="Select Worker"
                  />
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
                  <Select
                    name="Action"
                    options={actionOptions}
                    onChange={(selectedOption) =>
                      setFieldValue("Action", selectedOption.value)
                    }
                    placeholder="Select Action"
                  />
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
                    Save
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
                    <th>S.NO</th>
                    <th>Date</th>
                    <th>Worker Name</th>
                    <th>Action</th>
                    <th>Debit</th>
                    <th>Credit</th>
                    <th>Detail</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {workerAccountdata?.FetchWorkerAccount?.length === 0 ? (
                    <tr>
                      <td colSpan="8">
                        <h6 className="text-danger text-center py-3">
                          No data available in the table
                        </h6>
                      </td>
                    </tr>
                  ) : (
                    workerAccountdata?.FetchWorkerAccount
                      ?.slice()
                      .reverse()
                      .map((workeraccount, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{workeraccount.Date}</td>
                          <td>{workeraccount.WorkerId.WorkerName}</td>
                          <td>{workeraccount.Action}</td>
                          <td className="text-danger fw-bold">
                            {workeraccount.Debit}
                          </td>
                          <td className="text-primary fw-bold">
                            {workeraccount.Credit}
                          </td>
                          <td>{workeraccount.Detail}</td>
                          <td className="d-flex gap-2 flex-column flex-md-row">
                            <button
                              className="btn btn-sm btn-danger"
                              aria-label="Delete"
                              onClick={() =>
                                handleDeleteWorker(
                                  workeraccount._id,
                                  workeraccount.WorkerId._id
                                )
                              }
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