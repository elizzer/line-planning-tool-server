const JobAssignmentModel = require("../../models/jobAssignment");
const JobModel = require("../../models/jobs");
const LineModel = require("../../models/lines");
const FactoryModel = require("../../models/factory");

const getJobAssignemntControllers = require("./getJobAssignments");

async function create(req, res) {
  try {
    let {
      jobID,
      lineID,
      piecesPerDay,
      startDate,
      endDate,
      totalPieces,
      noOfDays,
    } = req.body;

    const userID = req.userId;
    if (!jobID) {
      throw new Error("JobID is missing");
    }
    let job = await JobModel.findOne({ userID: userID, _id: jobID });
    if (!job) {
      console.log({ userID: userID, _id: jobID });
      throw new Error("Job not found");
    }

    if (lineID) {
      let line = await LineModel.findById(lineID);
      let factory = await FactoryModel.findById(line.factoryID);
      if (factory.userID.toString() !== userID) {
        // console.log(factory.userID)
        throw new Error("Unauthorized action");
      }
    }

    if (startDate) {
      startDate = new Date(startDate);
      if (job.startDate && job.startDate > startDate) {
        throw new Error(
          `Job assignment is prior to Actual job start, the job starts from ${job.startDate.toISOString()}`
        );
      }
    }
    if (endDate) {
      endDate = new Date(endDate);
      if (job.endDate && job.endDate < endDate) {
        throw new Error(
          `Job assignment is after the Job finish date , the job finishes at ${job.endDate}`
        );
      }
    }

    if (piecesPerDay!==0 && startDate && endDate) {
      let _startDay = startDate.getDay();
      if (_startDay === 0) {
        console.log("start day is sunday");
        startDate.setDate(startDate.getDate() + 1);
      }
      console.log(startDate, endDate);
      let nod = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
      let nos = Math.floor(nod / 7);
      nod = nod - nos;
      totalPieces = piecesPerDay * nod;
      console.log(totalPieces);
      noOfDays = nod;
    } else if (startDate && piecesPerDay && totalPieces) {
      let nod = Math.ceil(totalPieces / piecesPerDay); // Number of operational days needed
      noOfDays = nod;
      let daysAdded = 0;
      endDate = new Date(startDate);

      while (daysAdded < nod) {
        endDate.setDate(endDate.getDate() + 1);
        // Skip Sundays
        if (endDate.getDay() !== 0) {
          daysAdded++;
        }
      }
    } else if (endDate && totalPieces!==0 && piecesPerDay!==0) {
      // Adjust end date if it is a Sunday
      if (endDate.getDay() === 0) {
        endDate.setDate(endDate.getDate() + 1);
      }

      let nod = Math.ceil(totalPieces / piecesPerDay);
      noOfDays = nod;
      let daysAdded = 0;
      startDate = new Date(endDate);

      while (daysAdded < nod) {
        startDate.setDate(startDate.getDate() - 1);
        // Skip Sundays
        if (startDate.getDay() !== 0) {
          daysAdded++;
        }
      }
    }
    if (lineID && startDate && endDate) {
      const dateConflictJobs = await JobAssignmentModel.find({
        lineID: lineID,
        startDate: {
          $gte: startDate,
          $lte: endDate,
        },
        endDate: {
          $gte: startDate,
          $lte: endDate,
        },
      });
      if (dateConflictJobs.length !== 0) {
        throw new Error(
          `Job conflict for this line starting:${dateConflictJobs[0].startDate.toISOString()} ending:${dateConflictJobs[0].endDate.toISOString()}`
        );
      }
    }

    console.log(job);
    console.log(req.body);

    if (job.totalPieces - job.assignedPieces + totalPieces >= 0) {
      job.assignedPieces += totalPieces;
      job.save();
    } else {
      throw new Error(
        `Assigning more than needed ${
          job.totalPieces
        } assigned ${(job.assignedPieces += totalPieces)}`
      );
    }

    const newJobAssignment = new JobAssignmentModel({
      jobID,
      lineID,
      piecesPerDay,
      startDate,
      endDate,
      totalPieces,
      noOfDays,
    });

    const savedJobAssignment = await newJobAssignment.save();

    return res.json({
      error: false,
      data: savedJobAssignment,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function update(req, res) {
  try {
    let {
      jobID,
      lineID,
      piecesPerDay,
      startDate,
      endDate,
      totalPieces,
      noOfDays,
    } = req.body;
    const userID = req.userId;
    const assignmentId = req.params.id; // Assuming assignment ID is passed in the request parameters

    // Check if the assignment ID is provided
    if (!assignmentId) {
      throw new Error("Assignment ID is missing");
    }

    // Find the existing job assignment and validate ownership
    let existingAssignment = await JobAssignmentModel.findById(assignmentId);
    if (!existingAssignment) {
      throw new Error("Job assignment not found");
    }

    // Find the associated job and validate ownership
    let job = await JobModel.findOne({ userID: userID, _id: jobID });
    if (!job) {
      throw new Error("Job not found");
    }

    // Validate line and factory ownership if lineID is provided
    if (lineID) {
      let line = await LineModel.findById(lineID);
      if (!line) {
        throw new Error("Line not found");
      }
      let factory = await FactoryModel.findById(line.factoryID);
      if (!factory || factory.userID.toString() !== userID) {
        throw new Error("Unauthorized action");
      }
    }

    // Convert date strings to Date objects if provided
    if (startDate) {
      startDate = new Date(startDate);
      if (job.startDate && job.startDate > startDate) {
        throw new Error(
          `Job assignment start date is prior to actual job start, which starts from ${job.startDate}`
        );
      }
    }
    if (endDate) {
      endDate = new Date(endDate);
      if (job.endDate && job.endDate < endDate) {
        throw new Error(
          `Job assignment end date is after the job finish date, which finishes at ${job.endDate}`
        );
      }
    }

    // Calculate totalPieces and noOfDays based on provided data
    if (piecesPerDay && startDate && endDate) {
      let _startDay = startDate.getDay();
      if (_startDay === 0) {
        startDate.setDate(startDate.getDate() + 1);
      }
      let nod = Math.ceil((endDate.getTime() - startDate.getTime()) / 86400000);
      let nos = Math.floor(nod / 7);
      nod = nod - nos;
      totalPieces = piecesPerDay * nod;
      noOfDays = nod;
    } else if (startDate && piecesPerDay && totalPieces) {
      let nod = Math.ceil(totalPieces / piecesPerDay);
      noOfDays = nod;
      let daysAdded = 0;
      endDate = new Date(startDate);

      while (daysAdded < nod) {
        endDate.setDate(endDate.getDate() + 1);
        if (endDate.getDay() !== 0) {
          daysAdded++;
        }
      }
    } else if (endDate && totalPieces && piecesPerDay) {
      if (endDate.getDay() === 0) {
        endDate.setDate(endDate.getDate() + 1);
      }

      let nod = Math.ceil(totalPieces / piecesPerDay);
      noOfDays = nod;
      let daysAdded = 0;
      startDate = new Date(endDate);

      while (daysAdded < nod) {
        startDate.setDate(startDate.getDate() - 1);
        if (startDate.getDay() !== 0) {
          daysAdded++;
        }
      }
    }

    // Check for date conflicts if lineID, startDate, and endDate are provided
    if (lineID && startDate && endDate) {
      const dateConflictJobs = await JobAssignmentModel.find({
        lineID: lineID,
        startDate: { $gte: startDate, $lte: endDate },
        endDate: { $gte: startDate, $lte: endDate },
        _id: { $ne: assignmentId }, // Exclude current assignment
      });
      if (dateConflictJobs.length !== 0) {
        throw new Error(
          `Job conflict for this line starting: ${dateConflictJobs[0].startDate.toISOString()} ending: ${dateConflictJobs[0].endDate.toISOString()}`
        );
      }
    }

    // Update the job's assignedPieces if the change is valid
    if (job.totalPieces - job.assignedPieces + totalPieces >= 0) {
      job.assignedPieces += totalPieces;
      await job.save();
    } else {
      throw new Error(
        `Assigning more than needed: ${job.totalPieces} assigned: ${
          job.assignedPieces + totalPieces
        }`
      );
    }

    // Update the existing job assignment with new values
    existingAssignment.jobID = jobID;
    existingAssignment.lineID = lineID;
    existingAssignment.piecesPerDay = piecesPerDay;
    existingAssignment.startDate = startDate;
    existingAssignment.endDate = endDate;
    existingAssignment.totalPieces = totalPieces;
    existingAssignment.noOfDays = noOfDays;

    // Save the updated job assignment
    const updatedJobAssignment = await existingAssignment.save();

    // Return success response with updated data
    return res.json({
      error: false,
      message: "Job assignment updated successfully",
      data: updatedJobAssignment,
    });
  } catch (error) {
    // Return error response if any error occurs
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function getJobAssignemnt(req, res) {
  try {

    console.log(req.query)
    if(req.query.jobID){
      console.log("Get job assignment by job id")
      _data=await getJobAssignemntControllers.getJobAssignemntByJobId(req)
      console.log(_data)
      return res.json(_data)
    }
    else if(req.query.jobAssignmentID){
      console.log("Get job assignment by job assignment id")
      _data=await getJobAssignemntControllers.getJobAssignemntByID(req)
      console.log(_data)
      return res.json(_data)
    }
    else {
      console.log("Get all job assignment")
      _data=await getJobAssignemntControllers.getAllJobAssignments(req)
      return res.json(_data)

    }
    
  } catch (e) {
    return res.json({
      error: true,
      message: e.message,
    });
  }
}



module.exports = { create, update, getJobAssignemnt };
