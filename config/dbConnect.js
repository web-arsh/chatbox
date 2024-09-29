import mongoose from "mongoose";

const dbConnect = async () => {
    try{
        await mongoose.connect(
            process.env.MONGO_URL,
            {dbName: "chat-box" });
        console.log("DB Connected");
    }
    catch(error){
        console.log("Db Connection failed",error.message);
    }
}

dbConnect();