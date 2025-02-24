import express from "express";
import { AddCustomer_Payment,GetCustomer_Payment,DeleteCustomer_Payment,GetCustomerLegder} from "../Controller/CustomerPaymentController.js";
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.post('/new',AuthenticateToken ,AuthenticateAdmin,AddCustomer_Payment)
router.delete('/delete/:PaymentId/:CustomerId',AuthenticateToken ,AuthenticateAdmin,DeleteCustomer_Payment)
router.get('/getall/:id',GetCustomer_Payment)
router.post('/getledger',AuthenticateToken ,AuthenticateAdmin ,GetCustomerLegder)

export default router