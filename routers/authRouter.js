const authRouter = require("express").Router();
const jwt = require("jsonwebtoken");
const user = require("../models/user");
const bcryptjs = require("bcryptjs");
authRouter.get("/signup",(req,res) => {
    res.render("\signup.ejs");
});
authRouter.post("/signup", async (req,res) => {
    console.log("HERE");
    console.log(req.cookies["myCookie"]);
    let useremail = req.body.useremail;
    let userpassword = req.body.userpassword;
    let username = req.body.username;
    const check = await user.findOne({$or : [{"useremail" : useremail},{"username" : username}]});
    if(check){
        res.status(400).json({"result" : "useremail or username is already in use"});
        return;
    }
    console.log(userpassword);
    const hashedPassword = bcryptjs.hashSync(userpassword,10);
    console.log(hashedPassword);
    console.log(bcryptjs.compareSync(userpassword,hashedPassword));
    userpassword=hashedPassword;
    const newUser = user({useremail: useremail,userpassword: userpassword, username : username });
    const savedUser = await newUser.save();
    console.log(savedUser);
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
    console.log(req.body);
    let useremail = req.body.useremail;
    let userpassword = req.body.userpassword;
    const dbUser = await user.findOne({useremail : useremail});
    console.log(dbUser);
    if(!dbUser){
        console.log("ere");
        res.status(400).json({"result" : "Useremail or password maybe incorrect"});
        return;
    }
    console.log(dbUser.userpassword.length);
    console.log(userpassword);
    let validPassword = bcryptjs.compareSync(userpassword,dbUser.userpassword);
    console.log(validPassword);
    if(validPassword==false){
        console.log("here");
        res.status(400).json({"result" : "Useremail or password maybe incorrect"});
        return;
    }
    let token = jwt.sign({data : useremail},process.env.JWT_SECRET,{expiresIn: "1h"});
    console.log(token);
    res.cookie("user_cookie",token,{expires: new Date(Date.now() + 3600000)});
    res.json({"result" : "Loggedin Successfully"});
});

module.exports = authRouter;