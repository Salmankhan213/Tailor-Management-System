import React from 'react'
import Home from './Pages/Home/Home'
import Appsetting from './Pages/Setting/Appsetting'
import {BrowserRouter , Routes,Route} from 'react-router-dom'
import OperatorInformation from './Pages/Setting/OperatorInformation'
import Setting from './Pages/Setting/Setting'
import ClothEntry from './Pages/ClothEntry/ClothEntry'
import CustomerEntry from './Pages/CustomerEntry/CustomerEntry'
import Measurement from './Pages/CustomerEntry/Measurement'
import OrderForm from './Pages/CustomerEntry/OrderForm'
import UpdateMeasurement from './Pages/CustomerEntry/UpdateMeasurement'
import CustomerPayment from './Pages/CustomerEntry/CustomerPayment'
import PrintMeasurement from './Pages/CustomerEntry/PrintMeasurement'
import UpdateCustomer from './Pages/CustomerEntry/UpdateCustomer'
import OrderMeasurement from './Pages/CustomerEntry/OrderMeasurement'
import OrderMeasPrint from './Pages/CustomerEntry/OrderMeasPrint'
import CustomerLedger from './Pages/CustomerEntry/CustomerLedger'
import WorkerEntry from './Pages/WorkerEntry/WorkerEntry'
import NotFoundPage from './Components/NotFoundPage'
import UpdateWorker from './Pages/WorkerEntry/UpdateWorker'
import WorkerAccountBook from './Pages/WorkerEntry/WorkerAccountBook'
import ExpensesEntry from './Pages/ExpensesEntry/ExpensesEntry'
import OrderProgress from './Pages/OrderProgress/OrderProgress'
import PaymentPrint from './Pages/CustomerEntry/PaymentPrint'
import Report from './Pages/Reports/Report'
import Login from './Components/Login'
import PublicRoutes from './Components/PublicRoutes'
import PrivateRoute from './Components/PrivateRoute'
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {

  return (
    <> 
    <BrowserRouter>
    <ToastContainer/>
    <Routes>
      <Route path='/' element={
        <PrivateRoute>
          <Home/>
        </PrivateRoute>
        } />
      <Route path='/setting' element={
        <PrivateRoute>
        <Setting/>
        </PrivateRoute>
        }>
      <Route path='appsetting' element={
        <PrivateRoute>
        <Appsetting/>
        </PrivateRoute>
        }/>
      <Route path='operatorinformation' element={ 
        <PrivateRoute>
        <OperatorInformation/>
        </PrivateRoute>
        }/>
      </Route>
      <Route path='/clothentry' element={
        <PrivateRoute> 
        <ClothEntry/>
        </PrivateRoute>
        } />
      <Route path='/customerentry' element={
        <PrivateRoute> 
        <CustomerEntry/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/update/:id' element={
        <PrivateRoute> 
        <UpdateCustomer/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/measurement/:id/:ind' element={
        <PrivateRoute> 
        <Measurement/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/measurement/update/:id/:custId' element={
        <PrivateRoute> 
        <UpdateMeasurement/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/orderform/:id/:ind' element={
        <PrivateRoute> 
        <OrderForm/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/payment/:id' element={
        <PrivateRoute> 
        <CustomerPayment/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/paymentprint' element={
        <PrivateRoute> 
        <PaymentPrint/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/customerledger/:id' element={
        <PrivateRoute> 
        <CustomerLedger/>
        </PrivateRoute>
        } />
      <Route path='/customerentry/printmeasurement' element={
        <PrivateRoute> 
        <PrintMeasurement/>
        </PrivateRoute>
      } />
      <Route path='/customerentry/order/measurement' element={
         <PrivateRoute> 
        <OrderMeasurement/>
        </PrivateRoute>
      } />
      <Route path='/customerentry/order/measurementprint' element={
        <PrivateRoute> 
        <OrderMeasPrint/>
        </PrivateRoute>
        } />
      <Route path='/workerentry' element={
        <PrivateRoute> 
        <WorkerEntry/>
        </PrivateRoute>
        } />
      <Route path='/worker/update/:id' element={
         <PrivateRoute> 
         <UpdateWorker/>
        </PrivateRoute>
        } />
      <Route path='/worker/workeraccountingbook' element={
        <PrivateRoute> 
        <WorkerAccountBook/>
        </PrivateRoute>
        } />
      <Route path='/expensesentry' element={
        <PrivateRoute> 
        <ExpensesEntry/>
        </PrivateRoute>
        } />
      <Route path='/orderprogress' element={
        <PrivateRoute> 
        <OrderProgress/>
        </PrivateRoute>
        } />
      <Route path='/reports' element={
        <PrivateRoute> 
        <Report/>
        </PrivateRoute>
        } />
      <Route path='/login' element={
        <PublicRoutes>
        <Login/>
        </PublicRoutes>
        } />
      <Route path='*' element={<NotFoundPage/>} />
     </Routes>
    
    </BrowserRouter>
 

    </>
  )
}

export default App
