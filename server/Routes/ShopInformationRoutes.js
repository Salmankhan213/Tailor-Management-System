import express from 'express'
import {createShopInfo,updateShopInfo,getShopInfo} from '../Controller/ShopInformationController.js'

const router = express.Router()


router.get('/getall',getShopInfo)
router.put('/update/:id',updateShopInfo)
router.post('/new',createShopInfo)

export default router