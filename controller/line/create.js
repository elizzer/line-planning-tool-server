const lineModel = require("../../models/lines");

async function create(req, res) {
  try {
    const { name, metadata } = req.body;

    let _existingLines = await lineModel.findOne({
      userId: req.userId,
      name: name,
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
