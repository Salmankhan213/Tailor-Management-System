import express from "express";
import {Add_Expenses,Delete_Expenses,Update_Expenses,Getall_Expenses} from '../Controller/AddExpensesController.js'
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin, Add_Expenses)
router.delete('/delete/:id',AuthenticateToken,AuthenticateAdmin,Delete_Expenses)
router.put('/update/:id',AuthenticateToken,AuthenticateAdmin,Update_Expenses)
router.get('/getall',Getall_Expenses)



export default router