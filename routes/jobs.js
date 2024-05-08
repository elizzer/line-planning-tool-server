const express=require("express")
const router = express.Router()

const createController = require("../controller/jobs/create")
const getJobByLineId=require("../controller/jobs/readByLineId")
const getLatestDateForLine=require("../controller/jobs/readLatestDateByLineId")

const deleteJobById = require("../controller/jobs/deteteJobById")

router.post("/",createController)
router.get("/latestDate/:lineid",getLatestDateForLine)
router.get("/:lineid",getJobByLineId)
router.delete("/:jobid",deleteJobById)


module.exports=router