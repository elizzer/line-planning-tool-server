const clientModel = require("../../models/clients");
const categoryModel = require("../../models/category");

async function getClientByIdController(req, res) {
  try {
    let client = await clientModel.findOne({
      _id: req.params.clientID,
      userID: req.userId,
    });

    if (!client) {
      throw new Error("Requested client not found");
    }

    
    return res.json({
      error: false,
      data: client,
    });

  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}

module.exports = getClientByIdController;
