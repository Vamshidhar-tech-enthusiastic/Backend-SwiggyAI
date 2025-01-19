const firmController=require('../controllers/firmController')
const express=require('express')
const verifyToken=require('../middleware/verifyToken')
const router=express.Router()
//routes to the endpoints
router.post('/addFirm',verifyToken,firmController.addFirm)
router.get('/getFirm',verifyToken,firmController.getFirm)
router.delete('/:id',firmController.deleteFirmById)

module.exports=router