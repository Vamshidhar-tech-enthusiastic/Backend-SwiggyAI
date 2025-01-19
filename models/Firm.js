const mongoose=require('mongoose')
//Firm or Restaurant Schema
const firmSchema=new mongoose.Schema(
{
    firmName:{
        type:String,
        required:true
    },
    area:
    {
        type:String,
        required:true,
        
    },
    category:
    {
        type:
        [
        {
            type:String,
            enum:['veg','non-veg']
        }
        ]
    },
    region:
    {
        type:
        [
        {
            type:String,
            enum:['north-indian','south-indian','chinese','bakery']
        }
        ]
    },
    offer:
    {
        type:String
        
    },
    image:
    {
        type:String
    },
    vendor:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'vendor'
    }],
    product:
    [
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'product'
        }
    ]
})

const Firm=mongoose.model('Firm',firmSchema)

module.exports=Firm