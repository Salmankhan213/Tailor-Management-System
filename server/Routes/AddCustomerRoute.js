import express from "express";
import {AddCustomer,DeleteCustomer,UpdateCustomer,GetallCustomer } from "../Controller/AddCustomerController.js";
import { AddCustomerMeasurement,GetallCustomerMeasurement,UpdateCustomerMeasurement,GetByIdCustomerMeasurement } from "../Controller/CustomerMeasurementConntroller.js";
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin,AddCustomer)
router.delete('/delete/:id',AuthenticateToken,AuthenticateAdmin,DeleteCustomer)
router.put('/update/:id',AuthenticateToken,AuthenticateAdmin,UpdateCustomer)
router.get('/getall',GetallCustomer)
router.post('/measurement/new',AuthenticateToken,AuthenticateAdmin,AddCustomerMeasurement)
router.get('/measurement/getall',GetallCustomerMeasurement)
router.put('/measurement/update/:id',AuthenticateToken,AuthenticateAdmin,UpdateCustomerMeasurement)
router.get('/measurement/getbyid/:id/:stitching',GetByIdCustomerMeasurement)


export default router