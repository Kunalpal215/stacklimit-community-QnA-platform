const mongoose = require("mongoose");
const answerSchema = new mongoose.Schema({
    queID: {
        type: String,
        required: true
    },
    answer: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    likers: {
        type: Array,
        default: []
    },
    imageLink: {
        type: String,
        default: ""
    }
});
module.exports = mongoose.model("answer",answerSchema);