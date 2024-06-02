const mongoose = require("mongoose");

const jobAssignmentSchema = mongoose.Schema({
  jobID: {
    type: mongoose.Types.ObjectId,
    ref: "Job",
    required: true,
  },
  lineID: {
    type: mongoose.Types.ObjectId,
    ref: "line",
    required: true,
  },
  piecesPerDay: {
    type: Number,
   
  },
  startDate: {
    type: Date,
  },
  totalPieces:Number,
  endDate: {
    type: Date,  
  },
  noOfDays: Number,
});

jobAssignmentSchema.index({jobID:1})
jobAssignmentSchema.index({lineID:1})

const jobAssignmentModel = mongoose.model("JobAssignment",jobAssignmentSchema)

module.exports=jobAssignmentModel