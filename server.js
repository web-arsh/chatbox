import "./config/dbConnect.js";
import express from "express";
import { UserRoute } from "./routes/user/User.js";
import { globalErrHandler } from "./middleware/globalErrHandler.js";
import { ConvoRoute } from "./routes/convo/Convo.js";
import { isLogin } from "./middleware/isLogin.js";
import { MessageRoute } from "./routes/message/Message.js";
import cors from "cors";
import { app, server } from "./Socket/socket.js";

const port = process.env.PORT || 3000;

//cors configuration

const corsOption = {
    origin: 'http://localhost:3000', // Allow requests from your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};


//middleware 

app.use(express.json());

app.use(cors(corsOption));

//User Route
app.use("/api/v1/user",UserRoute);

//Convo Route

app.use("/api/v1/convo",isLogin,ConvoRoute);

//Message Route

app.use("/api/v1/message",isLogin,MessageRoute);

//error handler

app.use(globalErrHandler);

server.listen(port,()=>{
    console.log(`Server is started at ${port}`);
});