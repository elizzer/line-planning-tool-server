const mongoose = require("mongoose")

const jobSchema=mongoose.Schema({
    lineNo:{
        type:mongoose.Types.ObjectId,
        ref:"lines",
        required:true
    },
    totalPieces:{
        type:Number,
        required:true
    },
    piecesPerDay:{
        type:Number,
        required:true
    },
    noOfDays:Number,
    startDate:{
        type:Date,
        required:true
    },
    endDate:{
        type:Date,
        required:true
    },
    color:String,
    jobName:String,
    metaData:String

})

const jobModel=mongoose.model("Job",jobSchema)

module.exports=jobModel