import express from "express"
import { allConvoCtrl, formUpdate, loginCtrl, registerCtrl, searchUser, updatepasswordCtrl } from "../../controllers/user/User.js";
import { isLogin } from "../../middleware/isLogin.js";
import multer from "multer";
import { storage } from "../../utils/cloudinary.js";

const UserRoute = express.Router();
const upload = multer({storage: storage});

UserRoute.post("/login",loginCtrl);

UserRoute.post("/search",isLogin,searchUser);

UserRoute.post("/register",registerCtrl);

UserRoute.get("/convo",isLogin,allConvoCtrl);

UserRoute.put("/password-update",isLogin,updatepasswordCtrl);

UserRoute.put("/form-update",isLogin,upload.single("avatar"),formUpdate);



export { UserRoute }