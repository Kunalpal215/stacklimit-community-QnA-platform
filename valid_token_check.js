const jwt = require("jsonwebtoken");
async function checkToken (req,res,next) {
    if(req.baseUrl === "/signup" || req.baseUrl === "/auth_page" || req.baseUrl === "/login"){
        return;
    }
    let token = req.cookies["user_cookie"];
    if(token){
        return jwt.verify(token,process.env.JWT_SECRET,(err,decoded) => {
            if(err){
                // token has expired
                res.json({"result" : "token expired"});
                return;
            }
            res.json({"result" : decoded["data"]});
        });
    }
    else{
        res.json({"result" : "no token passed"});
        return;
    }
}

async function checkTokenRoutes (req,res,next){
    
}

module.exports = checkToken;