const mongoose=  require("mongoose")

const SPLSchema=mongoose.Schema({
    clientId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Client"
    },
    name:{
        type:String,
        required:true
    }
})

const SPLModel=mongoose.model("SPL",SPLSchema)

module.exports=SPLModel