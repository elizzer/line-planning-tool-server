const express = require("express");
const router = express.Router();

const createController = require("../controller/jobs/create");
const getJobByLineId = require("../controller/jobs/readByLineId");
const getLatestDateForLine = require("../controller/jobs/readLatestDateByLineId");
const deleteJobById = require("../controller/jobs/deteteJobById");

const JobController = require("../controller/jobs/jobs");

router.post("/", JobController.create);
router.get("/:id", JobController.getJobsById);
router.get("/", JobController.getAllJobs);
router.patch("/:id",JobController.update)

module.exports = router;
