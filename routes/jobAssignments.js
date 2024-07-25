const express=require("express")
const router = express.Router()

const jobAssignmentController = require("../controller/jobAssignments/jobAssignment")

router.post("/",jobAssignmentController.create)
router.get("/",jobAssignmentController.getJobAssignemnt)

module.exports=router