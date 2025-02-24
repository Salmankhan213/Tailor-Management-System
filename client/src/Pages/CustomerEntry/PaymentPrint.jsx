import React,{useState,useEffect} from 'react'
import { useLocation,useNavigate } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { ShowPrint, HidePrint} from '../../redux/Services/Features/PrintSlice';
import { useTranslation } from 'react-i18next';

function PaymentPrint() {
  const {t,i18n} = useTranslation()
    const location = useLocation();
    const navigate = useNavigate()
    const { payment } = location.state || {}; 
    const dispatch = useDispatch()
    const IsActive = useSelector((state) => state.Print.IsActive)
    
    useEffect(() => {
      document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
    }, [i18n.language]);
  
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
      <div className="container mt-5" dir={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
        <div class="card">
          <div class="card-header bg-primary text-white">
            <h4 class="text-center">Payment Invoice</h4>
          </div>
          <div class="card-body">
            <div class="row mb-3">
              <div class="col-md-6">
                <h6>
                  <strong>Date:</strong> 2024-10-26
                </h6>
              </div>
              <div class="col-md-6 text-end">
                <h6>
                  <strong>Customer Name:</strong> {payment.CustomerName}
                </h6>
              </div>
            </div>

            <table class="table table-bordered">
              <thead class="table-light">
                <tr>
                  <th>Description</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Detail</td>
                  <td>{payment.Detail}</td>
                </tr>
                <tr>
                  <td>Receipt Amount</td>
                  <td>{payment.ReceiptAmount}</td>
                </tr>
                <tr>
                  <td>Remaining Dues</td>
                  <td>{payment.RemainingDues}</td>
                </tr>
              </tbody>
            </table>

            <div class="text-end mt-4">
              <h5>
                <strong>Total Paid:</strong>{payment.ReceiptAmount}
              </h5>
              <h6>
                <strong>Remaining Balance:</strong> {payment.RemainingDues - payment.ReceiptAmount}
              </h6>
            </div>
          </div>
          <div class="card-footer text-center">
            <p class="text-muted">Thank you for your payment!</p>
          </div>
        </div>
        <div className="d-flex gap-3 mt-5">
        <button
          onClick={handlePrint}
          className={`btn btn-success ${IsActive ? "d-none" : ""} print-button`}
        >
          Print
        </button>
        <button
          onClick={()=> navigate(`/customerentry/payment/${payment.CustomerId}`)}
          className={`btn btn-success ${IsActive ? "d-none" : ""} print-button`}
        >
         Back
        </button>
        </div>

      </div>
    );
}

export default PaymentPrint
