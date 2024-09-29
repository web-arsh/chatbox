import { Convo } from "../../model/convo/Convo.js";
import { Message } from "../../model/message/Message.js";
import { User } from "../../model/user/User.js";
import { getSocketId, io } from "../../Socket/socket.js";
import { AppErr } from "../../utils/AppErr.js";

const sendMessage = async (req,res,next) => {
    const {message} = req.body;
    const {id} = req.params;
    try {
        //this code check if existing convo is present in user 
        const acceptedRequest = await User.find({_id: req.user, convo: {$in: [id]}}).select("convo -_id"); 
        
        if(!acceptedRequest[0]) return next(new AppErr("Your are not allowed to send message",500));
        
        const findConvo = await Convo.findById(id).select("senderId receiverId -_id");

        //this code check if sender is existing user
        if(findConvo.senderId.toString() === req.user){
            const senderMessage = await Message.create({
                senderId: findConvo.senderId.toString(),
                receiverId: findConvo.receiverId.toString(),
                message
            });           
            
            const senderSocketID = getSocketId(findConvo.senderId);
            const receiverSocketID = getSocketId(findConvo.receiverId);

            if(senderSocketID){
                io.to(senderSocketID).emit("newMessage",senderMessage);
                io.to(receiverSocketID).emit("newMessage",senderMessage);
            }

            await Convo.findByIdAndUpdate(id,{
                $push: {message: senderMessage._id}
            });
            
            res.json({data: senderMessage});
        }
        else{
            //this code check if existing user is not sender
            const receiverMessage = await Message.create({
                senderId: findConvo.receiverId.toString(),
                receiverId: findConvo.senderId.toString(),
                message
            });

            const receiverSocketID = getSocketId(findConvo.receiverId);
            const senderSocketID = getSocketId(findConvo.senderId);
            if(receiverSocketID){
                io.to(receiverSocketID).emit("newMessage",receiverMessage);
                io.to(senderSocketID).emit("newMessage",receiverMessage);
            }

            await Convo.findByIdAndUpdate(id,{
                $push: {message: receiverMessage._id}
            });
            
            res.json({data: receiverMessage});
        }
    } catch (error) {
        next(new AppErr(error.message,500));
    }
}

const getMessage = async (req,res,next) => {
    const {id} = req.params;
    try {
        //this code check if existing convo is present in user 
        const acceptedRequest = await User.find({_id: req.user, convo: {$in: [id]}}).select("convo -_id"); 
        
        if(!acceptedRequest[0]) return next(new AppErr("Your are not allowed to fetch message",500));

        const findConvo = await Convo.findById(id).select("message senderId receiverId").populate("message senderId receiverId");
        
        res.json({data: findConvo});
        
    } catch (error) {
        next(new AppErr(error.message,500));
    }
}

const updateMessage = async (req,res,next) => {
    const {id} = req.params;
    const {msgStatus} = req.body;
    try {
        await Message.findByIdAndUpdate(id,{msgStatus});
        res.json({msg: "Message Update"});

    } catch (error) {
        next(new AppErr(error.message,500));
    }
}

const deleteMessage = async (req,res,next) => {
    const {id} = req.params;
    try {
        //check if message belongs to user
        const userMessage = await Message.find({senderId: req.user, _id: id}).select("_id");
        
        if(!userMessage[0]) return next(new AppErr("You are not allowed to delete this message"));

        const findConvo = await Convo.find({message: {$in: userMessage[0]._id}}).select("_id");
        
        await Message.findByIdAndDelete(id);
        
        await Convo.findByIdAndUpdate(findConvo[0]._id,{
            $pull: {message: id}
        });

        res.json({msg: "Message deleted"});
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const fileMessage = async (req,res,next) => {``
    const {id} = req.params;
    try {
        const findFileType = (req.file.mimetype.split("/")[0] === "image") ? "photo" : (req.file.mimetype.split("/")[0] === "audio") ? "audio" : (req.file.mimetype.split("/")[0] === "video") ? "video" :"file";
        //this code check if existing convo is present in user 
        const acceptedRequest = await User.find({_id: req.user, convo: {$in: [id]}}).select("convo -_id"); 
        
        if(!acceptedRequest[0]) return next(new AppErr("Your are not allowed to send message",500));
        
        const findConvo = await Convo.findById(id).select("senderId receiverId -_id");

        //this code check if sender is existing user
        if(findConvo.senderId.toString() === req.user){
            const senderMessage = await Message.create({
                senderId: findConvo.senderId.toString(),
                receiverId: findConvo.receiverId.toString(),
                message: req.file.path,
                msgType: findFileType
            });           
            
            const senderSocketID = getSocketId(findConvo.senderId);
            const receiverSocketID = getSocketId(findConvo.receiverId);

            if(senderSocketID){
                io.to(senderSocketID).emit("newMessage",senderMessage);
                io.to(receiverSocketID).emit("newMessage",senderMessage);
            }

            await Convo.findByIdAndUpdate(id,{
                $push: {message: senderMessage._id}
            });
            
            res.json({data: sendMessage});
        }
        else{
            //this code check if existing user is not sender
            const receiverMessage = await Message.create({
                senderId: findConvo.receiverId.toString(),
                receiverId: findConvo.senderId.toString(),
                message: req.file.path,
                msgType: findFileType
            });

            const receiverSocketID = getSocketId(findConvo.receiverId);
            const senderSocketID = getSocketId(findConvo.senderId);
            if(receiverSocketID){
                io.to(receiverSocketID).emit("newMessage",receiverMessage);
                io.to(senderSocketID).emit("newMessage",receiverMessage);
            }

            await Convo.findByIdAndUpdate(id,{
                $push: {message: receiverMessage._id}
            });
            
            res.json({data: receiverMessage});
        }

    } catch (error) {
        next(new AppErr(error.message,500));
    }
}

export { sendMessage,getMessage,deleteMessage,updateMessage,fileMessage}