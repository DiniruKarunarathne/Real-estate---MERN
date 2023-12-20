export const errorHandler = (statusCode , message) => {
    const error = new Error(); //create new error
    error.statusCode = statusCode; //set status code
    error.message = message; //set message
    return error; //return error
} //create error handler function