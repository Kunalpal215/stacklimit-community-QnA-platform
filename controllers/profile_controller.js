const userModel = require("../models/user");
const ObjectId = require("mongoose").Types.ObjectId;
const mongoose = require("mongoose");
exports.getUserProfile = async (req,res) => {
    const email = req.params.email;
    console.log(email);
    const user = await userModel.findOne({"useremail" : email});
    // const userID = req.params.userID;
    // let validUserId = ObjectId.isValid(userID);
    // if(!validUserId){
    //     res.render("not_found");
    //     return;
    // }
    // console.log(userID);
    // const user = await userModel.findById(userID);
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
            console.log(user);
            user["questionsAsked"] = user["questionsAsked"] + 1;
            await user.save();
            await session.commitTransaction();
        }
        catch (err){
            console.log(err);
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
            console.log(err);
            await session.abortTransaction();
        }
        finally{
            await session.endSession();
        }
}