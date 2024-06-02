const mongoose = require("mongoose");

const merchantSchema = mongoose.Schema({
  userid: {
    type: mongoose.Types.ObjectId,
    required:true,
    ref: "User",
  },
  name: {
    type: String,
    required: true,
  },
});

merchantSchema.index({userid:1})

const merchantModel = mongoose.model("Merchant", merchantSchema);

module.exports = merchantModel;
