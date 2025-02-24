import React,{useState,useEffect} from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetCustomerLedgerMutation } from "../../redux/Services/CustomerPaymentApi";
import { showErrorAlert, showSuccessAlert } from "../../util/SweetalertHelper";

function CustomerLedger(){
const {id} = useParams()
const { t ,i18n} = useTranslation();
const [ledger,setLedger] = useState([])
const [startDate,setStartDate] = useState('')
const [endDate,setEndDate] = useState('')
const [SeeLedgerData] = useGetCustomerLedgerMutation()

useEffect(() => {
  document.documentElement.dir = i18n.language === 'ur' ? 'rtl' : 'ltr';
}, [i18n.language]);
 
const handleCustomerLedger = async()=>{
  try {
    const data = {
      CustomerId:id,
      startDate,
      endDate
    }

    const res = await SeeLedgerData(data).unwrap()
    if(res.success){
      setLedger(res.FetchLedger)
    }
    if(!res.success){
      showErrorAlert(res.message)
    }
  } catch (error) {
    showErrorAlert(`An Error Accured ${error}`)
  }
}

const calculateTotalsAndBalance = () => {
  let totalCredit = 0;
  let totalDebit = 0;
  let balance = 0;

  const ledgerWithBalance = ledger.map((led) => {
    const credit = parseFloat(led.Credit) || 0;
    const debit = parseFloat(led.Debit) || 0;
    totalCredit += credit;
    totalDebit += debit;
    balance += credit - debit;
    return { ...led, balance };
  });

  return { ledgerWithBalance, totalCredit, totalDebit, balance };
};

const { ledgerWithBalance, totalCredit, totalDebit, balance } = calculateTotalsAndBalance();


  return (
    <>
      <div className="container" dir ={i18n.language === 'ur' ? 'rtl' : 'ltr'}>
      <div className="row my-3">
        <div className="col-md-12 d-flex gap-3">
          <input
            type="date"
            className=""
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input type="date" onChange={(e) => setEndDate(e.target.value)} />
          <button className="btn btn-danger" onClick={handleCustomerLedger} >See Ledger</button>
        </div>
      </div>
        <div className="row mt-5">
          <div className="col-md-12">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>DESCRIPTION</th>
                  <th>CREDIT</th>
                  <th>DEBIT</th>
                  <th>BALANCE</th>
                </tr>
              </thead>
              <tbody>
           {ledger.length === 0? (
            <tr>
              <td colSpan={5}>
              <h5 className="text-danger text-center">No data Found</h5>
              </td>
            </tr>
           ):(
            ledgerWithBalance.map((led,i)=>{
              return (
                <tr key={i}>
                <td>{led.Date}</td>
                <td>Description</td>
                <td>{led.Credit}</td>
                      <td>{led.Debit}</td>
                      <td
                        style={{
                          color: led.balance >= 0 ? "#0047AB" : "#E50000"
                        }}
                      >
                        {led.balance.toLocaleString()}
                      </td>
                </tr>
              )
            })

           )}

              </tbody>
            </table>
          </div>
        </div>
        {ledger.length > 0 && (
          <div className="row">
            <div className="col-md-12 text-center my-3">
              <h5>Total Credit: {totalCredit.toLocaleString()}</h5>
              <h5>Total Debit: {totalDebit.toLocaleString()}</h5>
              <h5>Total Balance: {balance.toLocaleString()}</h5>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
export default CustomerLedger;
