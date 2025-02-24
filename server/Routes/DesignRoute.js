import express from "express";
import { AddDesign,DeleteDesign,UpdateDesign,GetallDesign} from "../Controller/DesignController.js";
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'

const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin,AddDesign)
router.delete('/delete/:id',AuthenticateToken,AuthenticateAdmin,DeleteDesign)
router.put('/update/:id',AuthenticateToken,AuthenticateAdmin,UpdateDesign)
router.get('/getall',GetallDesign)

export default router