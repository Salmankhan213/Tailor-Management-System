import express from "express";
import { AddStitchingMeasurment,DeleteStitchingMeasurment,UpdateStitchingMeasurement,GetallStitchingMeasurment} from "../Controller/StitchingMeasurementController.js";
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.post('/new',AuthenticateToken ,AuthenticateAdmin,AddStitchingMeasurment)
router.delete('/delete/:id/:ind' ,AuthenticateToken ,AuthenticateAdmin,DeleteStitchingMeasurment)
router.put('/update/:id/:ind',AuthenticateToken ,AuthenticateAdmin,UpdateStitchingMeasurement)
router.get('/getall',GetallStitchingMeasurment)

export default router