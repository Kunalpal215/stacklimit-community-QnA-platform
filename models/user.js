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
        default: "https://stacklimit-community-qna-platform.onrender.com/images/profile-default.png"
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