import express from "express";
import { AddOrder_Items,GetOrder_Items,GetByIdOrder_Items ,StatusOrder_Items,ReadyOrder_item,GetOrder_Progress,DeleteOrder_Items} from "../Controller/OrderController.js";
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'

const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin,AddOrder_Items)
router.delete('/delete/:OrderId',AuthenticateToken,AuthenticateAdmin,DeleteOrder_Items)
// router.put('/update/:id',UpdateCustomer)
router.get('/getall',GetOrder_Items)
router.get('/getbyid/:id',GetByIdOrder_Items)
router.post('/status/:id',AuthenticateToken,AuthenticateAdmin,StatusOrder_Items)
router.post('/ready/:id',AuthenticateToken,AuthenticateAdmin,ReadyOrder_item)
router.post('/orderprogress',AuthenticateToken,AuthenticateAdmin,GetOrder_Progress)



export default router