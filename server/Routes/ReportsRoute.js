import express from "express";
import {GetAllReports} from '../Controller/ReportsController.js'
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.get('/getall',GetAllReports)



export default router 