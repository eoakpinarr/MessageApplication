const mongoose = require("mongoose")
const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
        //Eşsiz = unique
    },
    password: {
        type: String,
        required: true,
    },
    repassword: {
        type: String,
    },
    image: {
        type: String
    },
    friendRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    sendFriendRequest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }]
})

const User = mongoose.model("User", userSchema)
module.exports = User