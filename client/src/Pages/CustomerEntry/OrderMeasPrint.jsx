import React,{useEffect} from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector,useDispatch } from 'react-redux'
import { ShowPrint,HidePrint } from '../../redux/Services/Features/PrintSlice'

function OrderMeasPrint() {
    const location = useLocation()
    const {custMeas,orderItems} = location.state

    const dispatch = useDispatch()
    const IsActive = useSelector((state) => state.Print.IsActive)
    
    const handlePrint = () => {
      dispatch(ShowPrint(true))
      setTimeout(()=>{
        window.print(); 
      },0)
    };

    useEffect(() => {
      const handleAfterPrint = () => {
        dispatch(HidePrint(false))
      };
  
      window.addEventListener('afterprint', handleAfterPrint);
      return () => {
        window.removeEventListener('afterprint', handleAfterPrint);
      };
    }, [dispatch]);
  return (
   <>
       <div class="container">
        <div class="row mb-4">
            <div class="col-md-6 text-center">
      
                           <h5>{orderItems.CustomerId.CustomerName}</h5>
                           <p>{orderItems.CustomerId.PhoneNo}</p>
                           <p>{orderItems.typeStitching}</p>



            </div>
        </div>
      <div className="row">
        <div className="col-md-6">
        <table class="table table-bordered table-custom">
            <thead>
                <tr>
                    <th>S.No</th>
                    <th>Name</th>
                    <th>Measurement</th>
                </tr>
            </thead>
            <tbody>
            {
                custMeas?.Measurement?.map((measurement,i)=>{
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
        <p class="text-center">{orderItems.details}</p>
        </div>
      </div>

      <button className={` btn btn-success ms-5 mt-5 ${IsActive? 'd-none' : ''}` } onClick={handlePrint}>Print</button>

    </div>
   </>
  )
}

export default OrderMeasPrint
