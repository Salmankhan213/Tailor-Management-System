import express from "express";
import {UserRegister,GetAll_User,UserLogin,Delete_User} from '../Controller/AuthController.js'
import {AuthenticateToken} from '../Midllewares/AuthMiddleware.js'
import {AuthenticateAdmin} from '../Midllewares/AuthAdminMiddleware.js'

const router = express.Router()

router.post('/new',AuthenticateToken,AuthenticateAdmin,UserRegister)
router.post('/userlogin',UserLogin)
router.delete('/delete/:id',AuthenticateToken,AuthenticateAdmin,Delete_User)
// router.put('/update/:id',UpdateDesign)
router.get('/getall',GetAll_User)

export default router