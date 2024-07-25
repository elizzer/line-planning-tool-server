const jobAssignmentModel = require("../../models/jobAssignment");
const JobAssignmentModel = require("../../models/jobAssignment");
const jobModel = require("../../models/jobs");


async function getJobAssignemntByID(req,res){

    const jobAssignment = await JobAssignmentModel.findById(
        req.query.jobAssignmentID
      ).populate({
        path: "lineID",
        populate: {
          path: "factoryID",
        },
      });

      if (!jobAssignment) {
        throw new Error("Requested job assignment is not found")
      }
      const _jobAssignment = jobAssignment.toObject();
  
      const _jobId = await JobAssignmentModel.populate(_jobAssignment, {
        path: "jobID",
        populate: {
          path: "userID",
        },
      });
  
      if (req.userId !== _jobId.jobID.userID._id.toString()) {
        throw new Error("Unauthorized access");
      }
     
      return {
        error: false,
        data: jobAssignment,
      }
}

async function getJobAssignemntByJobId(req,res){
    const job = await jobModel.findById(req.query.jobID)
    if(job.userID.toString()!==req.userId){
        throw new Error("Unauthorized access")
    }

    const jobAsss = await  jobAssignmentModel.find({jobID:req.query.jobID})

    return {
        error:false,
        data:jobAsss
    }
}

async function getAllJobAssignments(req,res){
    const jobsIdList = await jobModel.find({userID:req.userId}).select("_id")
    // console.log(req.userId)
    console.log(jobsIdList)

    let jobAssList=[]

    for (let job of jobsIdList) {
        let jobAsss = await JobAssignmentModel.find({ jobID: job._id });
        jobAssList.push(jobAsss);
      }

    return {
        error:false,
        data:jobAssList
    }
}   


module.exports={getAllJobAssignments,getJobAssignemntByID,getJobAssignemntByJobId}