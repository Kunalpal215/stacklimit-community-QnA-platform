const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const userSchema = new mongoose.Schema({
    useremail : {
        type: String,
        required: true
    },
    userpassword : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    imageLink: {
        type: String,
        default: "http://localhost:3000/images/profile-default.png"
    },
    answersGiven: {
        type: Number,
        default: 0
    },
    questionsAsked: {
        type: Number,
        default: 0
    }
});

const user = mongoose.model("user",userSchema);

module.exports = user;