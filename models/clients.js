const mongoose = require("mongoose");

const clientSchema = mongoose.Schema({
    userID: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User",
    },
    name: {
        type: String,
        required: true
    },
    metadata: String,
    categories: [{
        name: String,
        metadata: String
    }],
    SPLs: [{
        name: String,
    }]
});

clientSchema.index({userID:1})

const clientModel = mongoose.model("Client", clientSchema);

module.exports = clientModel;