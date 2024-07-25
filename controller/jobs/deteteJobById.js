const jobModel = require("../../models/jobs")


async function deleteJobById(req,res){
    try {
        const _deletedJob=await jobModel.findByIdAndDelete(req.params.jobid)
        return res.json({
            error:false,
            data:_deletedJob,
            message:"Job deletetion success"
        })
    } catch (error) {
        return res.json({
            error:true,
            message:error.message
        })
    }
}

module.exports=deleteJobById