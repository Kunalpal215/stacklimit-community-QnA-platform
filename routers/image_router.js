const imageRouter = require("express").Router();
const imageController = require("../controllers/image_controller");
const multer = require("multer");
const uuid = require("uuid");
const fileStorageEngine = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,__dirname + "/../public/uploaded_images/");
    },
    filename: (req,file,cb) => {
        let parts = file.originalname.split(".");
        let fileExtension = parts[parts.length-1];
        cb(null,uuid.v4() + "." +  fileExtension);
    }
});
const upload = multer({storage: fileStorageEngine});

imageRouter.post("/image/upload",upload.single("myFile"),imageController.uploadImage);

module.exports = imageRouter