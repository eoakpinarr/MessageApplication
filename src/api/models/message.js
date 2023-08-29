const mongoose = require("mongoose")

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    recepientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    messageType: {
        type: String,
        enum: ["text", "image"]
    },
    message: String,
    imageUrl: String,
    timeStamp: {
        type: Date,
        default: Date.now
    }
})

const Message = mongoose.model("Message", messageSchema)
module.exports = Message