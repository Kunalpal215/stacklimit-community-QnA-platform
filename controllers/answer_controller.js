const ansModel = require("../models/answer");
const userModel = require("../models/user");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const {addAnswersGiven} = require("./profile_controller");

exports.postAnswer = async (req,res) => {
    let queID = req.query.id;
    let ans = req.body.answer;
    let imageLink = req.body.imageLink;
    const userDoc = await userModel.findOne({"useremail" : req.body.email});
    let username = userDoc["username"];
    await ansModel({queID: queID,answer: ans,username: username,imageLink: imageLink}).save()
    .then((ansDoc) => {
        res.json({"saved" : true});
        addAnswersGiven(userDoc["_id"]);
    })
    .catch((err) => {
        res.json({"saved" : false});
    });
}

exports.getAnswers = async (req,res) => {
    let queID = req.query.id;
    const answers = await ansModel.find({"queID" : queID});
    res.json({details : answers});
}

exports.addLike = async (req,res) => {

    // saved :
    // 0 -> need to login
    // 1 -> already liked
    // 2 -> successfully liked
    // 3 -> an error occured

    let ansID = req.query.ansID;
    let token = req.cookies["user_cookie"];
    if(!token){
        res.json({saved : 0,likes: 0,message: "You need to login to continue"});
        return;
    }
    let useremail;
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        useremail=decoded["data"];
    });
    let session = await mongoose.startSession();
    let saved = true;
    let likes;
    session.startTransaction();
    try{
        const ansDoc = await ansModel.findOne({"_id" : ansID}).session(session);
        if(ansDoc["likers"].includes(useremail)){
            saved=1;
            likes = ansDoc["likes"];
            return;
        }
        ansDoc["likes"] = ansDoc["likes"] + 1;
        ansDoc["likers"].push(useremail);
        likes = ansDoc["likes"];
        await ansDoc.save();
        await session.commitTransaction();
        saved=2;
    }
    catch(err){
        saved=3;
        await session.abortTransaction();
    }
    finally{
        res.json({saved : saved,likes: likes,message: saved==2 ? "Liked successfully" : (saved==3 ? "An error occured" : "Already liked")});
        await session.endSession();
    }
}
