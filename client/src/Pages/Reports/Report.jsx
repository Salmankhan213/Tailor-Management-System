import React, { useState } from 'react';
import Layout from '../Layout/Layout';
import axios from 'axios';
import { useGetWorkerQuery } from '../../redux/Services/AddWorkerApi';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import ReportExpensesTable from './ReportExpensesTable';
import { showErrorAlert, showSuccessAlert } from '../../util/SweetalertHelper';
import ReportOrderTable from './ReportOrderTable';
import ReportWorkerTable from './ReportWorkerTable';


function Report() {
  const { data: WorkerData } = useGetWorkerQuery();
  const [typeReports, setTypeReports] = useState('');
  const [reportdata,setReportData] = useState([])
 
  console.log('reportdata',reportdata)

//  pagination Logic

const DisplaytoData = reportdata
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


  const ReportSchema = Yup.object().shape({
    WorkerName: Yup.string().when('typeReport', {
      is: (typeReport) => typeReport === 'worker',
      then: (schema) => schema.required('Worker Name is required for Worker Report'),
      otherwise: (schema) => schema.notRequired(),
    }),
    startDate: Yup.date().required('Start Date is required'),
    endDate: Yup.date()
    .required('End Date is required')
    .min(Yup.ref('startDate'), 'End Date cannot be earlier than Start Date')
    .test('is-after', 'End Date must be after Start Date', function (value) {
      const { startDate } = this.parent;
      return startDate && value > startDate;
    }),
    typeReport: Yup.string().required('Please select a report type'),  
  });


  const handleGenerateReport = async (values) => {
    try {
      const response = await axios.get("http://localhost:2000/reports/getall", {
        params: values,
        withCredentials:true
      });
      console.log(response.data.message)
     if(response.data.success){
       showSuccessAlert('Data Fetch successfully! ')
       setReportData(response.data.reports)
     }if(!response.data.success){
      showErrorAlert(response.data.message)
     }
    } catch (error) {
      console.error("Error generating report:", error);
      showErrorAlert(error.message)
    }
  };
  const handleReportReset = (values)=>{
    console.log(values)
    if(values == typeReports){
      return;
    }else{
      setReportData([])
    }
  }

  return (
    <Layout>
      <div className="container mt-5">
        <h2 className="text-center mb-5">Report Section</h2>
        <Formik
          initialValues={{
            WorkerName: "",
            startDate: "",
            endDate: "",
            typeReport: typeReports || "",
          }}
          validationSchema={ReportSchema}
          onSubmit={handleGenerateReport}
        >
          {({setFieldValue }) => (
            <Form className="row g-3">
              {typeReports === "worker" ? (
                <div className="col-md-4">
                  <label htmlFor="WorkerName" className="form-label">
                    Worker Name
                  </label>
                  <Field
                    id="WorkerName"
                    name="WorkerName"
                    as="select"
                    className="form-select"
                  >
                    <option value="">Select Worker</option>
                    {WorkerData &&
                      WorkerData.FetchWorker?.map((worker, i) => (
                        <option value={worker._id} key={i}>
                          {worker.WorkerName}
                        </option>
                      ))}
                  </Field>
                  <ErrorMessage
                    name="WorkerName"
                    component="div"
                    className="text-danger"
                  />
                </div>
              ) : (
                ""
              )}

              <div className="col-md-4">
                <label htmlFor="reportType" className="form-label">
                  Report Type
                </label>
                <Field
                  id="reportType"
                  name="typeReport"
                  as="select"
                  className="form-select"
                  onChange={(e) => {
                    setFieldValue("typeReport", e.target.value);
                    setTypeReports(e.target.value);
                    handleReportReset(e.target.value)
                  }}
                >
                  <option value="">Select Report Type</option>
                  <option value="order">Order Report</option>
                  <option value="expenses">Expense Report</option>
                  <option value="worker">Worker Report</option>
                </Field>
                <ErrorMessage
                  name="typeReport"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="startDate" className="form-label">
                  Start Date
                </label>
                <Field
                  type="date"
                  name="startDate"
                  className="form-control"
                  id="startDate"
                />
                <ErrorMessage
                  name="startDate"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-md-4">
                <label htmlFor="endDate" className="form-label">
                  End Date
                </label>
                <Field
                  type="date"
                  name="endDate"
                  className="form-control"
                  id="endDate"
                />
                <ErrorMessage
                  name="endDate"
                  component="div"
                  className="text-danger"
                />
              </div>

              <div className="col-12 text-center mt-4">
                <button className="btn btn-primary" type="submit">
                  Generate Report
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <div className="row mt-5">
          {reportdata.length === 0 ? (
            <h5 className='text-danger text-center'>Data Not Found</h5>
          ): null}
          {typeReports === "expenses" && reportdata.length > 0 &&  <ReportExpensesTable data={CurrentItems} />}
          {typeReports === "order" && reportdata.length > 0 && <ReportOrderTable data={CurrentItems}/>}
          {typeReports === "worker" && reportdata.length > 0 && <ReportWorkerTable  data={CurrentItems}/>}
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
    </Layout>
  );
}

export default Report;
