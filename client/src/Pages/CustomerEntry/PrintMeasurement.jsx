import React,{useState,useEffect} from 'react'
import { useLocation } from 'react-router-dom';
import { useDispatch,useSelector } from 'react-redux';
import { ShowPrint, HidePrint} from '../../redux/Services/Features/PrintSlice';

function PrintMeasurement() {
    const location = useLocation();
    const { filterdata } = location.state || {}; 
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
      <div className="container">
        <h3 className="text-center">Customer Measurements</h3>
  
        {filterdata?.length > 0 ? (
          <div className='mt-5'>
            {filterdata?.map((measurement, index) => (
              <div key={index}>
                <h4>Customer Name: {measurement.CustomerId.CustomerName}</h4>
                <h5>Date: {new Date(measurement.Date).toLocaleDateString()}</h5>
                <h5>Type of Stitching: {measurement.TypeStitchingName}</h5>
                <div className="row">
                  {measurement.Measurement?.map((m, i) => (
                    <div key={i} className="col-6">
                      <strong>{m.detail}</strong>: {m.value}
                    </div>
                  ))}
                </div>
                <hr />
              </div>
            ))}
            <button onClick={handlePrint} className={`btn btn-success ${IsActive ? 'd-none' : ''} print-button`}>
              Print
            </button>
          </div>
        ) : (
          <p>No measurements available.</p>
        )}
      </div>
    );
}

export default PrintMeasurement
