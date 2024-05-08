const jobModel = require("../../models/jobs");
const lineModel = require("../../models/lines");

const {format,add} = require("date-fns")

async function create(req, res) {
  try {
    let {
      lineName,
      totalPieces,
      piecesPerDay,
      startDate,
      color,
      jobName,
      metaData,
    } = req.body; 

    //find the id of the line no
    const line = await lineModel.findOne({ name: lineName });

    if (!line) {
      throw new Error("Line name not found");
    }

    console.log(req.body)

    // console.log(totalPieces)
    totalPieces=parseInt(totalPieces)
    piecesPerDay=parseInt(piecesPerDay)

    startDate=startDate+"Z"
    let _nod = Math.ceil(totalPieces / piecesPerDay);
    let _nos = Math.floor(_nod/7)

    console.log(`[+]NOD ${_nod} and NOS ${_nos}`)

    let _startDate= new Date(startDate)

    console.log(_startDate)

    let _startDay = _startDate.getDay();


    let _endDate =new Date(startDate);

    _endDate.setDate(_endDate.getDate()+(_nos+_nod-1))

    // console.log(_endDate)



    if (_startDay === 0) {
      throw new Error("The start day is sunday");
    }

    if(!jobName){
        throw new Error("Job name not found")
    }

    //find is there any other job going in the selected line during the given

    const conflictJobs=await jobModel.find({lineNo:line._id, startDate:{$lte:_endDate}, endDate:{$gte:_startDate}}).sort({endDate:1})
    console.log("[=]Conflict jobs ",conflictJobs)
    if(conflictJobs.length!==0){
        throw new Error(`Conflict jobs are found in the given date for the line ${line.name} conflicted job ends at ${conflictJobs[0].endDate.toISOString()}`)
    }

    const newJob= new jobModel({
        lineNo:line._id,
        totalPieces,
        startDate:_startDate,
        endDate:_endDate,
        piecesPerDay,
        jobName,
        metaData,
        color,
        noOfDays:_nod+_nos
    })

    const savedJob= await newJob.save()

    return res.json({
      error: false,
      data: savedJob,
      conflictJobs
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = create;
