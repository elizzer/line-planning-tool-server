
const mongoose = require("mongoose")

const lineSchema = mongoose.Schema({

    factoryID:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Factory"
    },
    name:{
        type:String,
        required:true,
    },
    metadata:String,
})

lineSchema.index({ factoryID: 1 });

const lineModel=mongoose.model("line",lineSchema)
module.exports=lineModel