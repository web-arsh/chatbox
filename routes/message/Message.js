import express from "express";
import { getMessage, sendMessage, deleteMessage, updateMessage, fileMessage } from "../../controllers/message/Message.js";
import multer from "multer";
import { storage1 } from "../../utils/cloudinary.js";

const MessageRoute = express.Router();
const upload = multer({storage: storage1});

MessageRoute.post("/send-message/:id",sendMessage);

MessageRoute.post("/send-file/:id",upload.single("file"),fileMessage);

MessageRoute.get("/get-message/:id",getMessage);

MessageRoute.put("/update-message/:id",updateMessage);

MessageRoute.delete("/delete-message/:id",deleteMessage);


export {MessageRoute}