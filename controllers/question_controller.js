const questionModel = require("../models/question");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {addQuestionsAsked} = require("./profile_controller");

exports.getAllQuestions = async (req,res) => {
    console.log("files");
    console.log(req.files);
    const page = req.query.page;
    console.log(page);
    const toSkip = (page-1)*2;
    console.log(toSkip);
    const docsCount = await questionModel.countDocuments();
    if(toSkip>docsCount){
        res.json({"result" : false, "details" : []});
        return;
    }
    console.log("here");
    const questions = await questionModel.find().sort({"_id":-1}).skip(toSkip).limit(2);
    console.log(questions);
    console.log("ended");
    res.json({"result" : true,"details" : questions});
}

exports.getHotQuestions = async (req,res) => {
    const page = req.query.page;
    console.log(page);
    const toSkip = (page-1)*2;
    console.log(toSkip);
    const docsCount = await questionModel.countDocuments();
    if(toSkip>docsCount){
        res.json({"result" : false, "details" : []});
        return;
    }
    console.log("here");
    const questions = await questionModel.find().sort({"newlyViews":-1}).sort({"_id" : -1}).skip(toSkip).limit(2);
    console.log(questions);
    res.json({"details" : questions});
}

exports.postQuestion = async (req,res) => {
    console.log(req.body);
    let token = req.cookies["user_cookie"];
    if(!token){
        res.json({saved : false,message: "You need to login to continue"});
        return;
    }
    let useremail;
    console.log(useremail);
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        useremail=decoded["data"];
    });
    const user = await userModel.findOne({"useremail" : useremail});
    console.log(user);
    const newQue = new questionModel({title: req.body.title, description: req.body.description,imageLink: req.body.imageLink,username : user["username"]});
    await newQue.save().then((que) => {
        console.log(que);
        res.json({"saved" : true});
        console.log(user["_id"]);
        addQuestionsAsked(user["_id"]);
    }).catch((err) => {
        console.log(err);
        res.json({"saved" : false});
    });
    
}
exports.getQuestion = async (req,res) => {
    console.log(req.query.id);
    const que = await questionModel.findById(req.query.id);
    incrementViews(req,res);
    res.render("question_page", {id: req.query.id, title : que["title"], description: que["description"], username: que["username"],views: que["views"], imageLink : que["imageLink"]});
}

async function incrementViews(req,res){
    const session = await mongoose.startSession();
    session.startTransaction();
    try{
        const que = await questionModel.findById(req.query.id);
        que["views"] = que["views"] + 1;
        que["newlyViews"] = que["newlyViews"] + 1;
        await que.save();
        await session.commitTransaction();
    }
    catch (err){
        console.log(err);
        await session.abortTransaction();
    }
    finally{
        await session.endSession();
        return true;
    }
}

