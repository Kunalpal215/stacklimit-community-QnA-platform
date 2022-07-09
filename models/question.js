const mongoose = require("mongoose");
const questionSchema = new mongoose.Schema({
    title : {
        type: String,
        required: true
    },
    description : {
        type: String,
        required: true
    },
    username : {
        type: String,
        required: true
    },
    // date: {
    //     type: Date,
    //     default: new Date()
    // },
    views: {
        type: Number,
        default: 0
    },
    newlyViews: {
        type: Number,
        default: 0
    },
    imageLink: {
        type: String,
        default: true
    }
});
const question = mongoose.model("question",questionSchema)
module.exports = question;