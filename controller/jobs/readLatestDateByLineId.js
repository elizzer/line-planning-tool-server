const jobModel = require("../../models/jobs")
const {format}= require("date-fns")

async function readLatestDateByLineId(req,res){
    try {
        const _endDate=await jobModel.find({lineNo:req.params.lineid}).sort({endDate:-1})
        console.log(_endDate)
        return res.json({
            error:false,
            data:format(_endDate[0].endDate,"yyyy-MM-dd")
        })
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=readLatestDateByLineId