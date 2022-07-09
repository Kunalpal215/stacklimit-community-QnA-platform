const express = require("express");
const queRouter = express.Router();
const queController = require("../controllers/question_controller");

queRouter.get("/question/all",queController.getAllQuestions);

queRouter.get("/question/ask",(req,res) => {
    res.render("ask_question");
})

queRouter.post("/question/ask",queController.postQuestion);

queRouter.get("/question", queController.getQuestion);

queRouter.get("/question/hot", queController.getHotQuestions);

module.exports = queRouter;