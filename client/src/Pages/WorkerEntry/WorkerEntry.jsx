import React,{useState} from 'react'
import Layout from '../Layout/Layout'
import * as Yup  from 'yup'
import { Formik, Field, Form, ErrorMessage } from "formik";
import { useTranslation } from 'react-i18next'
import {useAddWorkerMutation,useGetWorkerQuery,useDeleteWorkerMutation} from '../../redux/Services/AddWorkerApi'
import {showErrorAlert,showSuccessAlert} from '../../util/SweetalertHelper'
import { Link } from 'react-router-dom';
import { useGetWorkerAccountQuery } from '../../redux/Services/WorkerAccountBookApi';

function WorkerEntry() {
 const {t} = useTranslation()
 const [WorkerAdding] = useAddWorkerMutation()
 const [WorkerDeleting] = useDeleteWorkerMutation()
 const {data:Workerdata} = useGetWorkerQuery()
 const  {refetch:workerAccountRefetch} = useGetWorkerAccountQuery()
 const [filterdata,setAFilterdata] = useState(null)

//  pagination Logic

 const DisplaytoData = filterdata || Workerdata?.FetchWorker || []
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
 
 const WorkerSchema = Yup.object({
    WorkerName: Yup.string().required('Worker  Name Required'),
    PhoneNo: Yup.string().required(t('phoneNoRequired')),
    CnicNo: Yup.string().required(t('cnicNoRequired')),
    Address: Yup.string().required(t('addressRequired')),
  });

  const handleAddWorker = async (values,{resetForm})=>{
    try {
     const newValue = {
      ...values,
      RemainingDues:0,
     }
      const res = await WorkerAdding(newValue).unwrap()
      if(res.success){
        showSuccessAlert(res.message)
        resetForm()
      }
      if(!res.success){
        showErrorAlert(res.message)
      }
    } catch (error) {
      showErrorAlert(error)
    }
  }

  const HanleDeleteWorker = async(id)=>{
    try {
    
       const res = await WorkerDeleting(id).unwrap()
       if(res.success){
         showSuccessAlert(res.message)
         workerAccountRefetch()
       }
       if(!res.success){
         showErrorAlert(res.message)
       }
     } catch (error) {
       showErrorAlert(error)
     }
  }

  const handleSearch = (value) => {
    if(!value){
      setAFilterdata(null)
      return;
    }
    const filterdata = Workerdata?.FetchWorker.filter((item) =>
      item.WorkerName.toLowerCase().includes(value.toLowerCase())
    );
    setAFilterdata(filterdata)
  };



  return (
    <Layout>
        <h5 className="text-bold py-2 mt-3 text-center">
        ADD WORKER
      </h5>
      <div className="container">
        <div className="row mt-4 py-2">
          <div className="col-md-6 mb-3 mb-md-0">
            <button
              type="button"
              className="btn btn-success fw-bold "
              data-bs-toggle="modal"
              data-bs-target="#staticBackdrop"
            >
              <i className="fa-solid fa-plus"></i> New Worker
            </button>
            <Link to={'/worker/workeraccountingbook'}
              type="button"
              className="btn btn-danger ms-3 fw-bold "
            >
              <i className="fa-solid fa-plus"></i> Worker Account book
            </Link>
          </div>
          <div className="col-md-6 d-flex gap-4 mb-2 mb-md-0">
            <label htmlFor="Search" className="fw-bold">
              {t("search")}
            </label>
            <input type="text"  className="form-control py-0" onChange={(e)=> handleSearch(e.target.value)} />
            <select name="rowpage" className='form-control w-25 bg-dark text-white' id="rowpage" onChange={(e)=>setRowPerPage( parseInt(e.target.value)) }>
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
                    <th>Worker Name</th>
                    <th>{t("phoneNo")}</th>
                    <th>{t("cnic")}</th>
                    <th>{t("address")}</th>
                    <th>RemainingDues</th>
                    <th>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {CurrentItems.length === 0 ? (
                    <tr>
                      <td colSpan="7">
                        <h5 className='text-danger  text-center py-3'>Data not found</h5>
                      </td>
                    </tr>
                  ) : (
                   CurrentItems?.slice().reverse().map((worker, i) => (
                      <tr key={worker.CnicNo}>
                        <td>{i + 1}</td>
                        <td>{worker.WorkerName}</td>
                        <td>{worker.PhoneNo}</td>
                        <td>{worker.CnicNo}</td>
                        <td>{worker.Address}</td>
                        <td className='text-danger fw-bold'>{worker.RemainingDues}</td>
                        <td className="d-flex gap-2 flex-column flex-md-row">
                          <Link to={`/worker/update/${worker._id}`} className="btn btn-sm btn-success" aria-label={t("edit")}>
                            <i className="fa-solid fa-pen"></i>
                          </Link>
                          <button className="btn btn-sm btn-danger" aria-label={t("delete")} onClick={()=>HanleDeleteWorker(worker._id)}>
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
                Add New Worker
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
                  WorkerName: "",
                  PhoneNo: "",
                  CnicNo: "",
                  Address: "",
                }}
                validationSchema={WorkerSchema}
                onSubmit={handleAddWorker}
              >
                {() => (
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
  )
}

export default WorkerEntry
