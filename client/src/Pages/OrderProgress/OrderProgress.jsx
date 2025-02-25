import React,{useState,useEffect} from "react";
import { useOrderProgressMutation } from "../../redux/Services/OrderApi";
import Layout from "../Layout/Layout";
import { useDeleteOrderMutation } from "../../redux/Services/OrderApi";
import {showErrorAlert, showSuccessAlert} from '../../util/SweetalertHelper'
import {useGetCustomerQuery} from '../../redux/Services/AddCustomerApi'
function OrderProgress() {
 const [AddOrderProgress] = useOrderProgressMutation()
 const [DeleteOrderData] = useDeleteOrderMutation()
 const {refetch:refetchCustomer} = useGetCustomerQuery()
 const [orderdata,setOrderdata] = useState([])





  const handleCustomerOrder = async ()=>{
    try {
        const res = await AddOrderProgress().unwrap()
        if(res.success){
          setOrderdata(res.OrderProgress)
        }if(!res.success){
          showErrorAlert(res.message)
        }
    } catch (error) {
      showErrorAlert(`An Error Accured ${error}`)
    }
  }

  const HandleDeleteOrder = async(id)=>{
    try {
      const res = await DeleteOrderData(id).unwrap()
      console.log('res',res)
      if(res.success){
        showSuccessAlert(res.message)
        refetchCustomer()
      }
      if(!res.success){
        showErrorAlert(res.message)
      }
    } catch (error) {
      showErrorAlert('An error Occured',error)
    }
  }
  return (

  <Layout>
      <div className="container" >
      <div className="row my-3">
        <div className="col-md-3 offset-5">
          <button className="btn btn-danger" onClick={handleCustomerOrder} >See Order</button>
        </div>
        </div>
      </div>
        <div className="row mt-5">
          <div className="col-md-12 table-responsive">
            <table className="table table-bordered table-striped">
              <thead>
                <tr>
                  <th>S.NO</th>
                  <th>DATE</th>
                  <th>CUSTOMER NAME</th>
                  <th>TOTAL PRICE</th>
                  <th>ADVANCE PRICE</th>
                  <th>DELIVERY DATE</th>
                  <th>ORDER DETAIL</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
           {orderdata.length === 0? (
            <tr>
                <td colSpan={8}>
                <h5 className="text-danger text-center">No data Found</h5>
                </td>
            </tr>
           ):(
            orderdata?.map((Progress,i)=>{
              return (
                <tr key={i}>
                <td>{i+1}</td>
                <td>{Progress.orderDate}</td>
                <td>{Progress.CustomerName}</td>
                <td>{Progress.TotalPrice}</td>
                <td>{Progress.AdvancePrice}</td>
                <td>{Progress.deliveryDate}</td>
                <td className="d-flex align-items-end">
                  <span className="bg-danger px-3 py-1 text-white fw-bold rounded-3">{Progress.status}</span>
                </td>
                <td> <span>typeStitching : {Progress.typeStitching}</span>
                <span> quantity : {Progress.quantity}</span>
                <br />  
                <span>stitchingPrice : {Progress.stitchingPrice}</span> 
                <span>  TotalPrice : {Progress.TotalPrice}</span> 
                 </td>
                 <td className="d-flex gap-2 flex-column flex-md-row align-items-center">
                    <button className="btn btn-sm btn-danger " onClick={()=>HandleDeleteOrder(Progress.OrderId)}>
                    <i className="fa-solid fa-trash"></i>
                    </button>
                 </td>
                </tr>
              )
            })

           )}

              </tbody>
            </table>
          </div>
        </div>
      </Layout>

  )
}

export default OrderProgress
