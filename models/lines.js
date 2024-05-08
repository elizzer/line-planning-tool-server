
const mongoose = require("mongoose")

const lineSchema = mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    userId:{
        type:mongoose.Types.ObjectId,
        required:true
    },
    metadata:String,
    currentjob:{
        type:mongoose.Types.ObjectId,
        ref:"jobs"
    }
})

const lineModel=mongoose.model("line",lineSchema)
module.exports=lineModel