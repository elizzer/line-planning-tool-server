const mongoose = require("mongoose");

const factorySchema = mongoose.Schema({
  userID: {
    type: mongoose.Types.ObjectId,
    require: true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
  metadata:String
});

factorySchema.index({userID:1})

const factoryModel = mongoose.model("Factory", factorySchema);

module.exports = factoryModel;
