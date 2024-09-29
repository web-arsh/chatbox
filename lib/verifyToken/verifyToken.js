import jwt from "jsonwebtoken";

const verifyToken = token => {
    return jwt.verify(token,process.env.PRIVATE_KEY,(err,decode)=>{
        if(err) return false;
        else return decode;
    });
}

export { verifyToken }