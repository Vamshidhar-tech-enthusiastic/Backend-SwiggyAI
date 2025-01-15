const productController= require('../controllers/productController')
const express=require('express')

const router=express.Router()

router.post('/addProduct/:firmID', productController.addProduct);
router.get('/getProduct', productController.getProduct);
router.get('/getProductByFirm/:id', productController.getProductByFirm);
router.delete('/:id',productController.deleteProductById)
router.get('/uploads/:imageName',(req,res)=>
    {
        const imgname=req.params.imageName;
        res.headersSent('Content-typ','image/jpeg')
        res.sendFile(path.join(__dirname,'..','uploads',imgname));
    });
module.exports=router