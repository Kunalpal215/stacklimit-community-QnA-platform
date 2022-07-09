const userModel = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");
exports.getUserProfile = async (req,res) => {
    const email = req.params.email;
    const user = await userModel.findOne({"useremail" : email});
    if(!user){
        res.render("not_found");
        return;
    }
    res.render("profile_page",{username : user["username"], useremail : user["useremail"], imageLink : user["imageLink"], answersGiven : user["answersGiven"], questionsAsked : user["questionsAsked"]});
}

exports.addQuestionsAsked = async (userID) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        try{
            const user = await userModel.findById(userID).session(session);
            user["questionsAsked"] = user["questionsAsked"] + 1;
            await user.save();
            await session.commitTransaction();
        }
        catch (err){
            await session.abortTransaction();
        }
        finally{
            await session.endSession();
        }
}


exports.addAnswersGiven = async (userID) => {
    const session = await mongoose.startSession();
        session.startTransaction();
        try{
            const user = await userModel.findById(userID);
            user["answersGiven"] = user["answersGiven"] + 1;
            await user.save();
            await session.commitTransaction();
        }
        catch (err){
            await session.abortTransaction();
        }
        finally{
            await session.endSession();
        }
}