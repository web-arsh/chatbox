import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username:{
            type: String,
            required: true
        },
        email:{
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        profile: {
            type: String,
            required: false
        },
        public_id:{
            type: String,
            required: false
        },
        convo:[
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Convo",       
            }
        ]
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User",UserSchema);

export { User }