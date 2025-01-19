const productController= require('../controllers/productController')
const express=require('express')

const router=express.Router()

router.post('/addProduct/:firmID', productController.addProduct);
router.get('/getProduct', productController.getProduct);
router.get('/getProductByFirm/:id', productController.getProductByFirm);
router.delete('/:id',productController.deleteProductById)

module.exports=router