const lineModel = require("../../models/lines");
const factoryModel = require("../../models/factory")

async function create(req, res) {
  try {
    const { name, metadata, factoryid } = req.body;
    console.log(factoryid)

    const factory =await factoryModel.findOne({_id:factoryid,userID:req.userId})

    if(!factory){
       return res.status(401).json({
            error:true,
            message:"User not authorized"
        })
    }

    let _existingLines = await lineModel.findOne({
      name: name,
      factoryID:factoryid
    });

    console.log(`[+]Existing lines `, _existingLines);

    if (_existingLines) {
      throw new Error("Line name already exist");
    }

    let newLine = new lineModel();

    if (!name) {
      throw new Error("Name for the new  line is required");
    }

    newLine.name = name;
    newLine.userId = req.userId;
    newLine.factoryID=factoryid

    if (metadata) newLine.metadata = metadata;

    const savedLine = await newLine.save();

    return res.json({
      error: false,
      message: "New line added",
      data: savedLine,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = create;
