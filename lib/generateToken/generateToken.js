import jwt from "jsonwebtoken";

const generateToken = id => {
    return jwt.sign({id},process.env.PRIVATE_KEY,{algorithm: "HS384",expiresIn: "10days"});
}


export { generateToken }