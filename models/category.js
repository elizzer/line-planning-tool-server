const mongoose=  require("mongoose")

const categorySchema=mongoose.Schema({
    clientID:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Client"
    },
    name:{
        type:String,
        required:true
    },
    metadata:String
})

const categoryModel=mongoose.model("Category",categorySchema)

module.exports=categoryModel