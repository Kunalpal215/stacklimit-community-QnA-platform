const jwt = require("jsonwebtoken");
async function checkToken (req,res,next) {
    console.log("Hello world 1");
    //console.log(req);
    if(req.baseUrl === "/signup" || req.baseUrl === "/auth_page" || req.baseUrl === "/login"){
        return;
    }
    console.log("Hello world");
    let token = req.cookies["user_cookie"];
    if(token){
        console.log("found token");
        return jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
            if(err){
                // token has expired
                res.json({"result" : "token expired"});
                return;
            }
            console.log("verified cookie");
            console.log(decoded);
            res.json({"result" : decoded["data"]});
        });
    }
    else{
        console.log("no token");
        res.json({"result" : "no token passed"});
        return;
    }
}

async function checkTokenRoutes (req,res,next){
    
}

module.exports = checkToken;