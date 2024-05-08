const jobModel = require("../../models/jobs")

async function readLineById(req,res){
    try {

        const lineId=req.params.lineid

        const jobs=await jobModel.find({lineNo:lineId}).sort({startdate:-1})
        return res.json({
            error:false,
            data:jobs
        })
        
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=readLineById