const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const bcryptjs = require("bcryptjs");
authRouter.get("/signup",(req,res) => {
    res.render("\signup.ejs");
});
authRouter.post("/signup", async (req,res) => {
    let useremail = req.body.useremail;
    let userpassword = req.body.userpassword;
    let username = req.body.username;
    const check = await user.findOne({$or : [{"useremail" : useremail},{"username" : username}]});
    if(check){
        res.status(400).json({"result" : "useremail or username is already in use"});
        return;
    }
    const hashedPassword = bcryptjs.hashSync(userpassword,10);
    userpassword=hashedPassword;
    const newUser = user({useremail: useremail,userpassword: userpassword, username : username });
    const savedUser = await newUser.save();
    if(savedUser){
        res.json({"result" : "Signed up Successfully"});
        return;
    }
    res.status(400).json({"result" : "An error occured while signing up"});
});
authRouter.get("/login",(req,res) => {
    res.render("login");
})
authRouter.post("/login",async (req,res) => {
    let useremail = req.body.useremail;
    let userpassword = req.body.userpassword;
    const dbUser = await user.findOne({useremail : useremail});
    if(!dbUser){
        res.status(400).json({"result" : "Useremail or password maybe incorrect"});
        return;
    }
    let validPassword = bcryptjs.compareSync(userpassword,dbUser.userpassword);
    if(validPassword==false){
        res.status(400).json({"result" : "Useremail or password maybe incorrect"});
        return;
    }
    let token = jwt.sign({data : useremail},process.env.JWT_SECRET,{expiresIn: "1h"});
    res.cookie("user_cookie",token,{expires: new Date(Date.now() + 3600000)});
    res.json({"result" : "Loggedin Successfully"});
});

module.exports = authRouter;