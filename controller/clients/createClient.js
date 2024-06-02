const clientModel = require("../../models/clients");
// const categoryModel = require("../../models/category");
// const SPLModel = require("../../models/SPL");

async function createClient(req, res) {
  try {
    const { name, metadata, categories, SPLs } = req.body;

    // Check if client name is duplicated
    const _duplicate = await clientModel.findOne({
      userID: req.userId,
      name: name,
    });

    console.log(SPLs)

    if (_duplicate) {
      throw new Error("Client name duplication");
    }

    // Create new client
    const newClient = new clientModel({
      name: name,
      metadata,
      userID: req.userId,
      categories: [],
      SPLs: []
    });

    // Add categories
    for (const category of categories) {
      newClient.categories.push(category);
    }

    // Add SPLs
    for (const spl of SPLs) {
      newClient.SPLs.push(spl);
    }

    // Save new client
    const savedClient = await newClient.save();
    
    return res.json({
      error: false,
      data: savedClient,
      message: "New client created successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: error.message,
    });
  }
}


module.exports = createClient;
