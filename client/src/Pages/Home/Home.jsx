import React,{ useEffect, useState} from 'react';
import Layout from "../Layout/Layout";
import { useGetOrderQuery } from '../../redux/Services/OrderApi';
import { useNavigate } from 'react-router-dom';
import { useGetWorkerQuery } from '../../redux/Services/AddWorkerApi';
import { useGetCustomerQuery } from '../../redux/Services/AddCustomerApi';
import {io} from 'socket.io-client'

function Home() {


 const {data:Orderdata} =  useGetOrderQuery()
const navigate = useNavigate()
const [filterdata,setAFilterdata] = useState(null)
const {data:WorkerData} = useGetWorkerQuery()
const {data:CustomerData} = useGetCustomerQuery()

const [overAll,setOverall] = useState({})
const [daily,setDaily] = useState({})

useEffect(() => {
  const socket = io('http://localhost:2000');

  socket.on('DailyOut', (data) => {
    setDaily(data);
  });

  socket.on('Overall', (data) => {
    setOverall(data);
  });
  return () => {
    socket.disconnect();
  };
}, []); 

// Pagination Logic
const DisplaytoData = filterdata || Orderdata?.FetchOrder || []
const [currentPage,setCurrentPage] = useState(1)
const [rowPerPage,setRowPerPage] = useState(10)
const ItemLastIndex = currentPage * rowPerPage
const ItemFirstIndex = ItemLastIndex - rowPerPage

const currentItems = DisplaytoData.slice(ItemFirstIndex,ItemLastIndex)
const totalPages = Math.ceil(DisplaytoData.length / rowPerPage)


const handlePrev = ()=>{
  setCurrentPage((prev)=> Math.max(prev-1,1))
}

const handleNext = ()=>{
  setCurrentPage((prev)=> Math.min(prev + 1,totalPages))
}
const handlePage = (Pagenumber)=>{
  setCurrentPage(Pagenumber)
}

 const HandleOrderMeasurement = (order)=>{
   navigate(`/customerentry/order/measurement`,{
  state:order
})
 }

 const handleSearch = (value) => {
  if(!value){
    setAFilterdata(null)
    return;
  }
  const filterdata = Orderdata?.FetchOrder.filter((item) =>
    item.CustomerId.CustomerName.toLowerCase().includes(value.toLowerCase())
  );
  setAFilterdata(filterdata)
};

  return (
    <Layout>
      <div className="container mt-5">
        <div className="row my-5 d-flex gap-3 gap-md-0">
          <div className="col-md-4 d-flex justify-content-center">
          <button className="btn btn-danger shadow w-md-75 w-100">
            Workers <span className="badge bg-light text-dark ms-2">{WorkerData?.FetchWorker?.length}</span>
          </button>
          </div>
        <div className="col-md-4 d-flex justify-content-center">
        <button className="btn btn-dark shadow w-md-75 w-100">
            Customer<span className="badge bg-light text-dark ms-2">{CustomerData?.FetchCustomer?.length}</span>
          </button>
        </div>
          <div className="col-md-4 d-flex justify-content-center">
          <button className="btn btn-success  shadow w-md-75 w-100">
            Order <span className="badge bg-light text-dark ms-2">{Orderdata?.FetchOrder?.length}</span>
          </button>
          </div>
        </div>
        
        <div className="row d-flex gap-3 gap-md-0">
          <div className="col-md-4 text-center">
          <div className="border rounded py-1 text-white w-md-75 w-100 mx-auto bg-success shadow">
            <h5 className="mb-0">{daily? daily.DailyAmount : 0}</h5>
            <small>Daily Outstanding</small>
          </div>
        </div>

        <div className="col-md-4 text-center">
          <div className="border rounded py-1 text-white w-md-75 w-100 mx-auto bg-success shadow">
            <h5 className="mb-0">{overAll? overAll.OverAllAmount : 0}</h5>
            <small>Over All Outstanding</small>
          </div>
        </div>
          
        </div>
    
        <h5 className='text-center my-5  fw-bold shadow py-2'>Order List</h5>


        <div className="col-md-4 d-flex gap-4 mb-3">
            <label htmlFor="Search" className="fw-bold">
              Search
            </label>
            <input type="text" className="form-control"  onChange={(e)=>handleSearch(e.target.value)}/>
            <select name="rowpage" className='form-control w-25 bg-dark text-white' id="rowpage" onChange={(e)=>setRowPerPage( parseInt(e.target.value)) }>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
            </select>
          </div>

        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>S.NO</th>
                <th>Customer Name</th>
                <th>Type Stitching</th>
                <th>Stitching</th>
                <th>Quantity</th>
                <th>Delivery Data</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                currentItems.slice().reverse().map((order,i)=>{
                  return (
                    <tr key={i}>
                    <td>{i+1}</td>
                    <td>{order.CustomerId.CustomerName}</td>
                    <td>{order.typeStitching}</td>
                    <td>{order.stitching}</td>
                    <td>{order.quantity}</td>
                    <td>
                      <span className={`px-2 py-1 text-white fw-bold  rounded-2 ${order.status == 'pending'? 'bg-danger':'bg-success'} `}>{order.status}</span>
                    </td>
                    <td>{order.deliveryDate}</td>
                    <td>
                      <button className='btn btn-sm btn-success ' onClick={()=>HandleOrderMeasurement(order)}>
                      <i className="fa-brands fa-creative-commons-nd"></i>
                      </button>
                    </td>
                  </tr>
                  )
                })
              }
            </tbody>
          </table>

          <div className="d-flex justify-content-center my-4">
            <button className='btn btn-danger btn-sm me-1' onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
            {Array.from({length:totalPages},(_,index)=>(
              <button className={`btn btn-sm mx-1 text-white ${currentPage === index+1 ? 'bg-success':'bg-primary'}`} onClick={()=>handlePage(index+1)} key={index+1}>{index+1}</button>
            ))}
            <button className='btn btn-danger btn-sm ms-1' onClick={handleNext} disabled={currentPage === totalPages}>Next</button>
          </div>

        </div> 
      </div>
    </Layout>
  );
}
export default Home;
