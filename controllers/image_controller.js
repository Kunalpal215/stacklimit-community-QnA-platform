const mongoose = require("mongoose");
const fs = require("fs");
const axios = require("axios");
const formData = require("form-data");
let data = new formData();
const jwt = require("jsonwebtoken");

exports.uploadImage = async (req,res) => {
    let token = req.cookies["user_cookie"];
    if(!token){
        res.json({saved : false,message: "You need to login to continue"});
        return;
    }
    let useremail;
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        useremail=decoded["data"];
    });
    let imageLink = "http://localhost:3000/uploaded_images/" + req.file.filename;
  res.json({result : true,link : imageLink});
}