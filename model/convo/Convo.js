import mongoose from "mongoose";

const convoSchema = new mongoose.Schema(
    {
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        message: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Message"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Convo = mongoose.model("Convo",convoSchema);

export { Convo }