//import all required packages.In our case express(to run),mongoose(data modeling),dotenv(security),body-parser(json text)

const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv')
const bodyParser=require('body-parser')
const cors=require('cors')
const vendorRoutes=require('./routes/vendorRoutes')
const firmRoutes=require('./routes/firmRoutes')
const productRoutes = require('./routes/productRoutes');
const app=express()
const PORT=9000

dotenv.config()
//mongodb connection

mongoose.connect(process.env.MONGO_URI)
.then(()=>{  console.log("MongoDB connected");})
.catch((error)=>{ console.log(error);})
app.use(bodyParser.json())
app.use(cors())
app.use('/vendor',vendorRoutes)
app.use('/firm',firmRoutes)
app.use('/product', productRoutes);
app.use('/uploads',express.static('/uploads'))
//run the app
app.listen(PORT,()=>
{
    console.log("Iam Ready at ",PORT)
})

//default route
app.use('/home',(req,res)=>
{
    res.send("<center><h2 style='color:red'>Welcome to Swiggy AI</h2><center>")
})
