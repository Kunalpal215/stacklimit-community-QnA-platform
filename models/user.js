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
        default: "https://infinite-cliffs-51192.herokuapp.com/images/profile-default.png"
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