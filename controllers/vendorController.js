const Vendor=require('../models/Vendor')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const dotenv=require('dotenv')
dotenv.config()
const key=process.env.secret
const vendorRegister= async(req,res)=>{
    const {username,email,password}=req.body;
    try
    {
            const Vemail=await Vendor.findOne({email});
            if(Vemail)
            {
                return res.status(400).json("Email already exists");
            }
            const hashedpass=await bcrypt.hash(password,10)
            const newVendor= new Vendor({
                username,
                email,
                password:hashedpass
            });
            await newVendor.save()
            return res.status(201).json("Vendor Registered.");
    }
    catch(error)
    {
          return res.status(400).json("Internal server error");
    }
}
const vendorLogin= async(req,res)=>{
    const {username,email,password}=req.body;
    try
    {
        const Vemail=await Vendor.findOne({email});
        if(!Vemail)
        {
            return res.status(401).json({error:"Invalid Vendor."});
        }
        else if(!(await bcrypt.compare(password,Vemail.password)))
        {
            return res.status(401).json({error:"Invalid password."})
        }
        const token=jwt.sign({vendorId: Vemail._id},key,{expiresIn:"1h"})
        return res.status(201).json({token:token,vendorId:Vemail._id})
        

    }
    catch(error)
    {
        return res.status(400).json("Internal server error");
    }
}
const getId=async(req,res)=>
{
    const vendorid=req.params.id;
    try
    {
          const vendor=await Vendor.findById(vendorid)
          if(!vendor){
            return res.status(400).json("Vendor Not Found.");
          }
          return res.status(200).json({vendorFirmId:vendor.firm});
    }
    catch(error)
    {
        return res.status(400).json(error);
    }
}
const getVendor=async(req,res)=>
{
    const vendorDetails=await Vendor.find().populate('firm');
    return res.json(vendorDetails);
}
const getVendorById=async(req,res)=>
{
    const vendorid=req.params.id;
    try
    {
          const vendor=await Vendor.findById(vendorid).populate('firm')
          if(!vendor){
            return res.status(400).json("Vendor Not Found.");
          }
          return res.status(200).json(vendor);
    }
    catch(error)
    {
        return res.status(400).json(error);
    }
}
module.exports={vendorRegister,vendorLogin,getVendor,getVendorById,getId}