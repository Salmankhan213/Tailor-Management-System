import express from "express";
import {AddWorkerAccount,DeleteWorkerAccount,GetallWorkerAccount} from '../Controller/WorkerAccountBookControler.js'
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin, AddWorkerAccount)
router.delete('/delete/:id/:workerId',AuthenticateToken,AuthenticateAdmin,DeleteWorkerAccount)
router.get('/getall',GetallWorkerAccount)


export default router