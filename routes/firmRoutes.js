const firmController=require('../controllers/firmController')
const express=require('express')
const verifyToken=require('../middleware/verifyToken')
const router=express.Router()

router.post('/addFirm',verifyToken,firmController.addFirm)
router.get('/getFirm',verifyToken,firmController.getFirm)
router.delete('/:id',firmController.deleteFirmById)

router.get('/uploads/:imageName',(req,res)=>
{
    const imgname=req.params.imageName;
    res.headersSent('Content-typ','image/jpeg')
    res.sendFile(path.join(__dirname,'..','uploads',imgname));
});
module.exports=router