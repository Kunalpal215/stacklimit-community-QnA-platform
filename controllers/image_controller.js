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
    console.log(useremail);
    jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
        useremail=decoded["data"];
    });
    console.log(req.file);
    let imageLink = "https://stormy-lake-92165.herokuapp.com/uploaded_images/" + req.file.filename;
    // const base64String = fs.readFileSync(req.file.path,'base64');
    // data.append("image",base64String);
    // // console.log(base64String);
    // let clientID = "Client-ID " + process.env.IMGUR_CLIENT_ID;
    // console.log(clientID);
    // var config = {
    //     method: "POST",
    //     url: "https://api.imgur.com/3/image",
    //     headers: {
    //         "Authorization" : clientID,
    //     },
    //     data: data
    // }
    // await axios(config).then((response) => {
    //     console.log(response);
    //     imageLink = response.data.data.link;
    // }).catch((err) => {
    //     console.log(err);
    //     res.json({result : false,link : ""})
    // });
  res.json({result : true,link : imageLink});
}