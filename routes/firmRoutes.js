const firmController=require('../controllers/firmController')
const express=require('express')
const verifyToken=require('../middleware/verifyToken')
const router=express.Router()

router.post('/addFirm',verifyToken,firmController.addFirm)
router.get('/getFirm',verifyToken,firmController.getFirm)
router.delete('/:id',firmController.deleteFirmById)

router.get('/uploads/:imageName', (req, res) => {
    const imgname = req.params.imageName;
    const contentType = mime.lookup(imgname) || 'application/octet-stream'; 
    res.setHeader('Content-Type', contentType); 
    res.sendFile(path.join(__dirname, '..', 'uploads', imgname), (err) => {
        if (err) {
            
            res.status(404).send('Image not found');
        }
    });
});
module.exports=router