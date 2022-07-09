const express = require("express");
const answerRouter = express.Router();
const answerControllers = require("../controllers/answer_controller");
answerRouter.post("/question/ans",answerControllers.postAnswer);
answerRouter.get("/question/ans",answerControllers.getAnswers);
answerRouter.post("/question/ans/like",answerControllers.addLike);
module.exports = answerRouter;