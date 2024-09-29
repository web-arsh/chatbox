import { Convo } from "../../model/convo/Convo.js"
import { User } from "../../model/user/User.js";
import { getSocketId, io } from "../../Socket/socket.js";
import { AppErr } from "../../utils/AppErr.js"

const requestAccept = async (req,res,next) => {
    const { id } = req.params; //whose request is accept
    try {
        //if request sender and acceptor has same id
        if(id === req.user) return next(new AppErr("You don't accept your request",500));

        const acceptRequest = await Convo.find({senderId: id,receiverId:req.user});
        
        //if user doesn't have any request
        if(acceptRequest.length === 0) return next(new AppErr("You don't have any request",500));

        //in this code convo id is add to sender and receiver id  and. $addToSet add id to array if it doesnot exists
        await User.findByIdAndUpdate(req.user,{
            $addToSet: {convo: acceptRequest[0]._id}
        });
        
        await User.findByIdAndUpdate(id,{
            $addToSet: {convo: acceptRequest[0]._id}
        });
        
        /////////////////////////////////////////////////////////

        res.json({msg: "Request Accepted"});
    } catch (error) {
        next(new AppErr(error.message));
    }
}

const requestSend  = async (req,res,next) => {
    const {id} = req.params; //id = whom request is send
    try {
        //this code check if user send request to ourself
        if(id === req.user) return next(new AppErr("You cannot send request to yourself",500));

        //this alreadyrequest check if sender doesnot send multiple request to receiver
        const alreadyRequest = await Convo.find({receiverId: id,senderId: req.user}).select("id");
        
        //this moreRequest check if receiver doesnot send request to sender.
        const moreRequest = await Convo.find({receiverId: req.user,senderId: id}).select("id");
        

        if(alreadyRequest.length !== 0 || moreRequest.length !== 0 ) return next(new AppErr("Request already have",500));
       
        
       const newRequest = await Convo.create({
            senderId: req.user,
            receiverId: id
        });
        
        const recevierID = getSocketId(id);
        if(recevierID){
            io.to(recevierID).emit("unAcceptedRequest",newRequest);
        }
        
        res.json({msg: "Request Send"});
    } catch (error) {
        next(new  AppErr(error.message,500));
    }
}

const allRequest = async (req,res,next) => {
    try {
        //this code find only those user convo which is accepted
        const userHaveRequest = await User.findById(req.user).select("convo");
        
        //this code show only those convo which is not accepted
        const showRequests = await Convo.find({receiverId: req.user, _id:{$nin: userHaveRequest.convo}}).populate("senderId receiverId");
        

        res.json({data: showRequests,userId: req.user});
    } catch (error) {
        next(new AppErr(error.message,500));
    }
}

const showAcceptedRequest = async (req,res,next) => {
    try {
        //this code find only those user convo which is accepted
        const userHaveRequest = await User.findById(req.user).select("convo");
        
        //this code show only those convo which is accepted
        const showRequests = await Convo.find({$and: [{$or:[{receiverId: req.user},{senderId: req.user}]},{ _id:{$in: userHaveRequest.convo}}]});
        
        res.json({data:showRequests});
    } catch (error) {
        next(new AppErr(error.message,500));
    }
}


const blockRequest = async (req,res,next) => {
    const {id} = req.params;
    try {
        //if user block ourself
        if(id === req.user) return next(new AppErr("Existing user doesn't block",500));
        
        //check if trusted user block convo

        const findUserConvo = await User.find({_id: req.user, convo: {$in: [id]}}).select("id");

        //this code runs when authorized user delete convo
        if(findUserConvo.length !== 0){
             //find the convo which want to block
            const blockConvo = await Convo.findById(id).select("senderId receiverId");

            await User.updateOne({_id: blockConvo.receiverId},{
                $pull: {convo: {$in: [id]}}
            });
        
            
            await User.updateOne({_id: blockConvo.senderId},{
                $pull: {convo: {$in: [id]}}
            });
            
            await Convo.findByIdAndDelete(id);     
            
            return res.json({msg: "User Block"}); 
        }
         

        return res.json({msg: "Unauthorized User"});
    } catch (error) {
        next(new AppErr(error.message,500));
    }
}

export { requestAccept , requestSend , allRequest , blockRequest ,showAcceptedRequest}