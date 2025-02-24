import express from "express";
import { AddWorker,UpdateWorker,DeleteWorker,GetallWorker } from "../Controller/AddWorkerController.js";
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'

const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin,AddWorker)
router.delete('/delete/:id',AuthenticateToken,AuthenticateAdmin,DeleteWorker)
router.put('/update/:id',AuthenticateToken,AuthenticateAdmin,UpdateWorker)
router.get('/getall',GetallWorker)


export default router