const jobModel = require("../../models/jobs");
const clientModel = require("../../models/clients");
const merchantModel = require("../../models/merchant");
const jobAssignmentModel = require("../../models/jobAssignment");

function string_to_date(date) {
  let _dateSplit = date.split("-");
  return new Date(
    (year = parseInt(_dateSplit[2])),
    (monthIndex = parseInt(_dateSplit[1]) - 1),
    (date = parseInt(_dateSplit[0]))
  );
}

async function create(req, res) {
  try {
    let {
      clientID,
      SPLID,
      merchantID,
      categoryID,
      IMAN,
      model,
      totalPieces,
      startDate,
      endDate,
      color,
      name,
      metaData,
    } = req.body;
    const userID = req.userId;

    console.log("reqbody",req.body)
    // dates in dd-mm-yyyy format
    // console.log(req.params)
    if (!name) {
      throw new Error("Job name required");
    }
    if (!clientID) {
      throw new Error("Client not choosen");
    }
    let _duplicatename = await jobModel.find({
      userID: userID,
      name: name,
    });

    if (_duplicatename.length !== 0) {
      throw new Error("Duplicate job name");
    }

    let query = {
      userID: userID,
      _id: clientID,
    };

    if (SPLID) {
      query["SPLs._id"] = SPLID;
    }

    if (categoryID) {
      query["categories._id"] = categoryID;
    }
    console.log("[+]Client find query ", query);

    let _client = await clientModel.find(query);

    if (_client.length === 0) {
      throw new Error("No matching client found");
    }

    let _merchant = await merchantModel.find({
      userID: userID,
      _id: merchantID,
    });

    if (!_merchant) {
      throw new Error("Unrecoganized Merchant");
    }

    if (startDate) {
      startDate = new Date(startDate);
    }
    if (endDate) {
      endDate = new Date(endDate);
    }
    if (IMAN) {
      IMAN = parseInt(IMAN);
    }
    if (model) {
      model = parseInt(model);
    }
    if (totalPieces) {
      totalPieces = parseInt(totalPieces);
    }

    let newJob = new jobModel({
      userID,
      clientID,
      SPLID,
      merchantID,
      categoryID,
      IMAN,
      model,
      totalPieces,
      startDate,
      endDate,
      color,
      name,
      metaData,
    });

    const _savedJob = await newJob.save();

    return res.json({
      error: false,
      message: "New job created",
      data: _savedJob,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function getAllJobs(req, res) {
  try {
    let jobs = await jobModel
      .find({ userID: req.userId })
      .populate("merchantID");

    for (let i = 0; i < jobs.length; i++) {
      let job = jobs[i];

      // Find the client document using clientID from the job document
      let client = await clientModel.findOne({ _id: job.clientID });

      if (!client) {
        console.warn(`Client not found for job ID: ${job._id}`);
        continue;
      }

      // Convert the job and client documents to plain JavaScript objects
      job = job.toObject();

      // Update the job fields with values from the client document
      job.categoryID = client.categories.id(job.categoryID)?.toObject() || null;
      job.SPLID = client.SPLs.id(job.SPLID)?.toObject() || null;
      client = client.toObject();

      // Delete unwanted attributes from the client object
      delete client.categories;
      delete client.SPLs;
      delete client.userID;
      delete client.__v;

      // Assign the modified client object to job.clientID
      job.clientID = client;

      // Update the jobs array with the modified job object
      jobs[i] = job;

      // Log the updated job
      console.log(job);
    }

    res.json({
      error: false,
      data: jobs,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function getJobsById(req, res) {
  try {
    const jobId = req.params.id;

    let jobs = await jobModel
      .findOne({ _id: jobId, userID: req.userId })
      .populate("merchantID");

    let client = await clientModel.findOne({ _id: jobs.clientID });

    console.log(jobs);

    jobs = jobs.toObject(); // Convert the Mongoose document to a plain JavaScript object
    jobs.categoryID = client.categories.id(jobs.categoryID); // Directly accessing the category subdocument
    jobs.SPLID = client.SPLs.id(jobs.SPLID); // Directl
    client = client.toObject();
    delete client.categories;
    delete client.SPLs;
    delete client.userID;
    delete client.__v;
    jobs.clientID = client; // Adding new field clientName instead of overwriting clientID

    const jobAssignment = await jobAssignmentModel
      .find({ jobID: jobId })
      .populate({
        path: "lineID",
        populate: {
          path: "factoryID",
        },
      });

    return res.json({
      error: false,
      data: { jobs, jobAssignment },
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
      clientID,
      SPLID,
      merchantID,
      categoryID,
      IMAN,
      model,
      totalPieces,
      startDate,
      endDate,
      color,
      name,
      metaData,
    } = req.body;
    const userID = req.userId;
    const jobId = req.params.id;

    // Check if the job exists and belongs to the current user
    let existingJob = await jobModel.findOne({ _id: jobId, userID: userID });
    if (!existingJob) {
      throw new Error("Job not found or unauthorized");
    }

    // Check for duplicate job name except for the current job
    let _duplicatename = await jobModel.find({
      userID: userID,
      name: name,
      _id: { $ne: jobId },
    });
    if (_duplicatename.length !== 0) {
      throw new Error("Duplicate job name");
    }

    let query = {
      userID: userID,
      _id: clientID,
    };

    if (SPLID) {
      query["SPLs._id"] = SPLID;
    }

    if (categoryID) {
      query["categories._id"] = categoryID;
    }

    console.log("[+]Client find query ", query);
    let _client = await clientModel.find(query);

    if (_client.length === 0) {
      throw new Error("No matching client found");
    }

    let _merchant = await merchantModel.find({
      userID: userID,
      _id: merchantID,
    });

    if (!_merchant) {
      throw new Error("Unrecognized Merchant");
    }

    // Convert date strings to Date objects if provided
    if (startDate) {
      startDate = new Date(startDate);
    }
    if (endDate) {
      endDate = new Date(endDate);
    }
    if (IMAN) {
      IMAN = parseInt(IMAN);
    }
    if (model) {
      model = parseInt(model);
    }
    if (totalPieces) {
      totalPieces = parseInt(totalPieces);
    }

    // Update the existing job object with new values
    existingJob.clientID = clientID;
    existingJob.SPLID = SPLID;
    existingJob.merchantID = merchantID;
    existingJob.categoryID = categoryID;
    existingJob.IMAN = IMAN;
    existingJob.model = model;
    existingJob.totalPieces = totalPieces;
    existingJob.startDate = startDate;
    existingJob.endDate = endDate;
    existingJob.color = color;
    existingJob.name = name;
    existingJob.metaData = metaData;

    // Save the updated job object
    const updatedJob = await existingJob.save();

    return res.json({
      error: false,
      message: "Job updated successfully",
      data: updatedJob,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = { create, getAllJobs, getJobsById, update };
