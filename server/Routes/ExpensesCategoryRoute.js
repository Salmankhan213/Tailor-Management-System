import express from "express";
import {AddExpenses_Category,DeleteExpenses_Category,UpdateExpenses_Category,GetallExpenses_Category} from '../Controller/ExpensesCategoryController.js' 
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin,AddExpenses_Category)
router.delete('/delete/:id',AuthenticateToken,AuthenticateAdmin,DeleteExpenses_Category)
router.put('/update/:id',AuthenticateToken,AuthenticateAdmin,UpdateExpenses_Category)
router.get('/getall',GetallExpenses_Category)


export default router