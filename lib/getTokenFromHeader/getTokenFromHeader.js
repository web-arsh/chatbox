const getTokenFromHeader = req => {
    const header = req.headers;
    const token = (header["authorization"]?.split(" ")[1]);
    
    if(token !== undefined){
        return token;
    }
    return {
        status: "failed",
        msg: "There is no token attached to header"
    };
}

export { getTokenFromHeader }