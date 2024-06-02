const mongoose = require("mongoose")

const jobSchema=mongoose.Schema({
    userID:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"User"
    },
    clientID:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Client"
    },
    SPLID:{
        type:mongoose.Types.ObjectId,
    },
    categoryID:{
        type:mongoose.Types.ObjectId
    },
    merchantID:{
        type:mongoose.Types.ObjectId,
        ref:"Merchant"
    },
    IMAN:{
        type:Number,
    },
    model:{
        type:Number,
    },
    totalPieces:{
        type:Number,
    },
    assignedPieces:{
        type:Number,
        default:0
       
    },
    startDate:{
        type:Date,
    },
    endDate:{
        type:Date,
    },
    color:String,
    name:{
        type:String,
        required:true
    },
    metaData:String,

})

jobSchema.index({ userID: 1 });
jobSchema.index({ clientID: 1 });
jobSchema.index({ SPLID: 1 });
jobSchema.index({ merchantID: 1 });
jobSchema.index({ categoryID: 1 });
jobSchema.index({ IMAN: 1 });
jobSchema.index({ models: 1 });
jobSchema.index({ jobName: 1 });

const jobModel=mongoose.model("Job",jobSchema)

module.exports=jobModel