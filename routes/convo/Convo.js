import express from "express"
import { allRequest, blockRequest, requestAccept, requestSend, showAcceptedRequest } from "../../controllers/convo/Convo.js";

const ConvoRoute = express.Router();

ConvoRoute.get("/request",allRequest);

ConvoRoute.get("/show-request",showAcceptedRequest)

ConvoRoute.post("/request-accept/:id",requestAccept);

ConvoRoute.post("/request-send/:id",requestSend);

ConvoRoute.delete("/block/:id",blockRequest);



export { ConvoRoute }