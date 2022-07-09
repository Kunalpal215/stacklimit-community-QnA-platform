const express = require("express");
const app = express();
const mongoose = require("mongoose");
const authRouter = require("./routers/authRouter");
const queRouter = require("./routers/question_router");
const answerRouter = require("./routers/answer_router");
const imageRouter = require("./routers/image_router");
const profileRouter = require("./routers/profile_router");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const checkToken = require("./valid_token_check");
const bodyParser = require("body-parser");
const cron = require("node-cron");
const queModel = require("./models/question");

dotenv.config();
app.set("view engine","ejs");
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use("/",authRouter);
app.use("/",queRouter);
app.use("/",answerRouter);
app.use("/",imageRouter);
app.use("/",profileRouter);
app.use(express.static(__dirname + "/public"));
app.get("/",(req,res) => {
    res.render("home");
});

app.get("/check_login",checkToken);

app.get("/auth_page",(req,res) => {
    res.render("auth_page");
});

mongoose.connect(process.env.MONGODB_URL,() => {
    app.listen(process.env.PORT || 3000,() => {
        cron.schedule("59 23 28 * *",async () => {
            const ques = await queModel.find();
            ques.forEach( async element => {
                const session = await mongoose.startSession();
                session.startTransaction();
                try{
                    const user = await queModel.findById(element["_id"]);
                    user["newlyViews"]=0;
                    await user.save();
                    await session.commitTransaction();
                }
                catch(err){
                    await session.abortTransaction();
                }
                finally{
                    await session.endSession();
                }
            });
        });
    });
});