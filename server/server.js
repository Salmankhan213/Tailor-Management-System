import express from 'express'
import cors from "cors"
import dotenv from 'dotenv'
import { DbConnect } from './Config/db.js'
import cookieParser from 'cookie-parser'
import colors from 'colors'
import { Server } from 'socket.io'
import http from "http"



import StitchingCategoryRoute from './Routes/StitchingCategoryRoute.js'
import StitchingMeasurementRoute from './Routes/StitchingMeasurementRoute.js'
import DesignRoute from './Routes/DesignRoute.js'
import AddCustomerRoute from './Routes/AddCustomerRoute.js'
import OrderRoute from './Routes/OrderRoute.js'
import CustomerPaymentRoute from './Routes/CustomerPaymentRoute.js'
import AddWorkerRoute from './Routes/AddWorkerRoute.js'
import WorkerAccountBookRoute from './Routes/WorkerAccountBookRoute.js'
import ExpensesCategoryRoute from './Routes/ExpensesCategoryRoute.js'
import AddExpensesRoute from './Routes/AddExpensesRoute.js'
import ReportsRoute from './Routes/ReportsRoute.js'
import AuthRoute from "./Routes/AuthRoute.js"
import {OverAll_Outstanding,Daily_Outstanding} from './Controller/OutstandingController.js'
import ShopInformationRoutes from './Routes/ShopInformationRoutes.js'


dotenv.config()

 
const app = express()

DbConnect()
const port  = process.env.PORT

app.use(cookieParser())
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


const server = http.createServer(app)
const io = new Server(server,{
  cors:{
    origin: 'http://localhost:5173',
    credentials:true
  }
})
io.on('connection', (socket) => {
  
  const handleOutstanding = async () => {
      const overallData = await OverAll_Outstanding();
      const dailyData = await Daily_Outstanding();
      
      socket.emit('DailyOut', dailyData);
      socket.emit('Overall', overallData);
  };

  handleOutstanding(); // Emit initially on connection

  const intervalId = setInterval(handleOutstanding, 10000); // Adjusted interval to 10 seconds
  
  socket.on('disconnect', () => {
      clearInterval(intervalId);
  });
});

app.use('/stitching/category', StitchingCategoryRoute)
app.use('/stitching/measurement', StitchingMeasurementRoute)
app.use('/stitching/design', DesignRoute)
app.use('/customer/', AddCustomerRoute)
app.use('/customer/order', OrderRoute)
app.use('/customer/payment', CustomerPaymentRoute)
app.use('/worker/', AddWorkerRoute)
app.use('/workeraccountbook/', WorkerAccountBookRoute)
app.use('/expensescategory/', ExpensesCategoryRoute)
app.use('/addexpenses/', AddExpensesRoute)
app.use('/reports/',ReportsRoute )
app.use('/auth/',AuthRoute)
app.use('/shopinfo',ShopInformationRoutes)


app.use((err,req,res,next)=>{
  const error = err.message
  res.json({
    message:error,
    success:false
  })
})






server.listen(port, ()=>{
    console.log(`server is running port number ${port}`.bgCyan)
})