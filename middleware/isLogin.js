import { getTokenFromHeader } from "../lib/getTokenFromHeader/getTokenFromHeader.js";
import { verifyToken } from "../lib/verifyToken/verifyToken.js"
import { AppErr } from "../utils/AppErr.js";

const isLogin = (req,res,next) => {
    const token = getTokenFromHeader(req);
    const checkLogin = verifyToken(token);

    req.user = checkLogin.id;
    
    if(!checkLogin){
        return next(new AppErr("Invalid/Expire token",500));
    }
    next();
}

export  { isLogin };