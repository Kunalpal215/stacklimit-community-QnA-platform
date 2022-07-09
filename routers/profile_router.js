const express = require("express");
const profileRouter = express.Router();
const profileController = require("../controllers/profile_controller");
profileRouter.get("/user/get/:email",profileController.getUserProfile);
module.exports = profileRouter;