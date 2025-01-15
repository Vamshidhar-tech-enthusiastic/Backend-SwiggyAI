const Vendor=require('../models/Vendor')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config()
const key=process.env.secret
const verifyToken= async(req,res,next)=>{
    const token=req.headers.token;
    if(!token)
    {
        return res.status(401).json("token is required.");
    }
    try
    {
        const decoded= jwt.verify(token,key);
        const vendor= await Vendor.findById(decoded.vendorId)
        if(!vendor)
        {
            return res.status(401).json(vendor);
        }
        req.vendorId=vendor._id
        next();
    }
    catch(error)
    {
        return res.status(401).json("Internal Server Error.");
    }
}
module.exports=verifyToken