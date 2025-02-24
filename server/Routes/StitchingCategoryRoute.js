import express from "express";
import { AddStitchingCategory,DeleteStitchingCategory,UpdateStitchingCategory,GetallStitchingCategory} from "../Controller/StitchingCategoryController.js";
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'
const router = express.Router()

router.post('/new',AuthenticateToken, AuthenticateAdmin,AddStitchingCategory)
router.delete('/delete/:id',AuthenticateToken, AuthenticateAdmin,DeleteStitchingCategory)
router.put('/update/:id',AuthenticateToken, AuthenticateAdmin,UpdateStitchingCategory)
router.get('/getall',GetallStitchingCategory)

export default router