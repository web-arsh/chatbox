import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        senderId: {
            type: String,
            required: true
        },
        receiverId: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        msgStatus:{
            type: String,
            required: false,
            default: "received"
        },
        msgType: {   
          type: String,
          enum:["photo","video","audio","file","text"],
          default: "text"  
        },
        reply:{
            type: String,
            required: false
        }
    },
    {
        timestamps: true
    }
);

const Message = mongoose.model("Message",messageSchema);

export { Message}