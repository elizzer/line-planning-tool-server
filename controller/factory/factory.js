const factoryModel = require("../../models/factory");
const lineModel = require("../../models/lines");



async function createFactoryController(req, res) {
  try {
    const { name, metadata, lines } = req.body;
    const _duplicate = await factoryModel.findOne({
      userID: req.userId,
      name: name,
    });

    if (_duplicate) {
      throw new Error("Factory name duplication");
    }

    const newFactory = new factoryModel({
      name: name,
      metadata,
      userID: req.userId,
    });

    let savedLines = [];
    let processedLineNames = new Set(); // Set to keep track of processed line names
    if (lines) {
      console.log("[+]Lines ", lines);
      // Use Promise.all to await all async operations in parallel
      await Promise.all(
        lines.map(async (e) => {
          if (!processedLineNames.has(e.name)) {
            processedLineNames.add(e.name); // Add line name to set
            const newLine = new lineModel({
              factoryID: newFactory._id,
              name: e.name,
              metadata: e.metadata ? e.metadata : "",
            });

            let savedLine = await newLine.save();
            console.log(`[=]Saved line ${savedLine}`);
            savedLines.push(savedLine);
          } else {
            console.log(`[!]Skipping duplicate line name: ${e.name}`);
          }
        })
      );
    }

    let savedFactory = await newFactory.save();
    savedFactory = { ...savedFactory._doc, savedLines }; // Corrected variable name here

    return res.json({
      error: false,
      data: savedFactory,
      message: "New factory created successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function getAllFactoryController(req, res) {
  try {
    const factory = await factoryModel.find({ userID: req.userId });
    if (!factory) {
      throw new Error("Requested factorys not found");
    }
    return res.json({
      error: false,
      data: factory,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function getFactoryByIdController(req, res) {
  try {
    const factory = await factoryModel.findOne({
      _id: req.params.factoryId,
      userID: req.userId,
    });

    const lines = await lineModel.find({
      factoryID:req.params.factoryId
    })

    if (!factory) {
      throw new Error("Requested factory not found");
    }

    const _returnData={...factory._doc,lines}

    return res.json({
      error: false,
      data: _returnData,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function updateFactoryByIdController(req, res) {
  try {
    const { name, metadata } = req.body;
    let updates = {};
    console.log("updated facroty id ",req.params.factoryId)
    if (name) {
      const _duplicate = await factoryModel.findOne({
        userID: req.userId,
        name: name,
        _id:{$ne:req.params.factoryId}
      });
      console.log(_duplicate);
      if (_duplicate) {
        throw new Error("Line name duplication");
      }
      updates.name = name;
    }
    if (metadata) {
      updates.metadata = metadata;
    }

    const updatedfactory = await factoryModel.findOneAndUpdate(
      { _id: req.params.factoryId, userID: req.userId },
      updates,
      { new: true }
    );

    if (!updatedfactory) {
      throw new Error("Update unsuccessfull");
    }

    return res.json({
      error: false,
      data: updatedfactory,
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

async function deleteFactoryByIdController(req, res) {
  try {
    const _deletedfactory = await factoryModel.findOneAndDelete({
      _id: req.params.factoryId,
      userID: req.userId,
    });

    if (!_deletedfactory) {
      throw new Error("factory attempt to delete no exitst");
    }

    return res.json({
      error: false,
      data: _deletedfactory,
      message: "factory Deletion success",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = {
  createFactoryController,
  getAllFactoryController,
  getFactoryByIdController,
  updateFactoryByIdController,
  deleteFactoryByIdController,
};
