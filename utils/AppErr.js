class AppErr extends Error{
    constructor(messsage,statusCode){
        super(messsage);
        this.statusCode = statusCode;
    }
}

export {AppErr}