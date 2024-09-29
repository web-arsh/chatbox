import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { verifyToken } from "../lib/verifyToken/verifyToken.js";

const user = {};
const app = express();
const server = createServer(app);

const getSocketId = (id) => {
    return user[id];
}

const io = new Server(server,{
    cors:{
        origin: "https://fabulous-boba-4e334b.netlify.app",
        methods: ["GET","POST"],
        allowedHeaders: ["Content-Type","Authorization"],
        credentials: true
    }
});

//if token is invalid disconnect
io.use((socket,next)=>{
    const token = socket.handshake.auth.token.split(" ")[1];
    
    const checkToken = verifyToken(token);
    if(!checkToken){
        socket.disconnect(true);
        next(new Error("invalid"));       
    }
    
    socket.data.id = checkToken.id;
    next();
});


io.on("connection",(socket)=>{
    console.log("a user connected",socket.id);
    
    //////////online users////////////
    if(socket.data.id){
        user[socket.data.id] = socket.id;
    }
    io.emit("onlineUser",Object.keys(user));

    
    ///////////////////////////////
    
    socket.on("disconnect",()=>{
        delete user[socket.data.id];
        io.emit("onlineUser",Object.keys(user));
        console.log("a user disconnected",socket.id);
    });
});

export {server , app , io, getSocketId }
