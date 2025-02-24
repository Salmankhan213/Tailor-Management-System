import React, { useEffect, useState } from 'react'
import { useGetByIdCustMeasurementQuery } from '../../redux/Services/CustomerMeasurementApi'
import { useGetOrderbyIdQuery,useStatusOrderMutation ,useReadyOrderMutation} from '../../redux/Services/OrderApi'
import { useLocation, useNavigate,  } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { showErrorAlert, showSuccessAlert } from '../../util/SweetalertHelper'

function OrderMeasurement() {
    const {t,i18n} = useTranslation()
 const  location = useLocation()
 const navigate = useNavigate()
  const [custMeas, setCustMeas] = useState(null);
  const [orderItems, setOrderItems] = useState(null);

 useEffect(() => {
    document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
  }, [i18n.language]);
    const {
        CustomerId,
        _id,
        typeStitching
    } = location.state
    const CustId = CustomerId._id
  const  {data:CustMeasurement} = useGetByIdCustMeasurementQuery({CustId,typeStitching})
  const  {data:OrderItemdata} = useGetOrderbyIdQuery(_id)
  const  [ChangeOrderStatus] = useStatusOrderMutation()
  const  [ReadyOrder] = useReadyOrderMutation()
 

  useEffect(()=>{
    setCustMeas(CustMeasurement?.fetchCustomerMeasurement)
    setOrderItems(OrderItemdata?.FetchOrder)
  },[CustMeasurement,OrderItemdata])


  const handlePrint = ()=>{
    navigate('/customerentry/order/measurementprint',{
      state:{
        custMeas,
        orderItems
      }
    })
  }
  const handleStatusOrder = async()=>{
    try {
     const {_id} =  location.state
      const res = await ChangeOrderStatus(_id).unwrap()
      if(res.success){
        showSuccessAlert(res.message)
      }
      else if (!res.success){
        showErrorAlert(res.message)
      }
    } catch (error) {
      next(error)
    }
  }
  const handleReadyOrder = async()=>{
    try {
     const {_id} =  location.state
      const res = await ReadyOrder(_id).unwrap()
      if(res.success){
        showSuccessAlert(res.message)
      }
      else if (!res.success){
        showErrorAlert(res.message)
      }
    } catch (error) {
      next(error)
    }
  }
  return (
  <>
  <div className="container" dir={i18n.language === "ur" ? "rtl" : "ltr"}>
    <div className="row">
        <div className="col-md-6">
            <div className="row">
                <div className="col-md-12 my-3">
                    <button className='btn btn-success w-50' onClick={handleStatusOrder}>Order Delivery</button>
                </div>
                <div className="col-md-12">
                    <button className='btn btn-warning w-50' onClick={handleReadyOrder}>Order Ready Email</button>
                </div>
                <div className="col-md-12 my-3">
                    <button className='btn btn-primary w-50' onClick={handlePrint}>Measurement Print</button>
                </div>
                <div className="col-md-12">
                    <button className='btn btn-danger w-50' onClick={()=>navigate('/')}>Close</button>
                </div>
            </div>
        </div>
        <div className="col-md-6">
        <div className="table-responsive">
          <table className="table table-bordered text-center">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Stitching</th>
                <th>Measurement</th>
        
              </tr>
            </thead>
            <tbody>
              {
                CustMeasurement && CustMeasurement?.fetchCustomerMeasurement?.Measurement?.map((measurement,i)=>{
                  return (
                    <tr key={i}>
                    <td>{i+1}</td>
                    <td>{measurement.detail}</td>
                    <td>{measurement.value}</td>
                  </tr>
                  )
                })
              }
         
            </tbody>
          </table>
        </div>
        </div>
    </div>
    <div className="row my-2">
        <div className="col-md-6 d-flex justify-content-center offset-6">
        <textarea className='w-100 px-3' name="Detials" id="detials" disabled value={OrderItemdata?.FetchOrder?.details}>
        </textarea>
        </div>
    </div>
  </div>
  </>
  )
}

export default OrderMeasurement
