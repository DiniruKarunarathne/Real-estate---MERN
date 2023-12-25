import jwt from 'jsonwebtoken';
import { errorHandler } from "./error.js";

// Purpose: verify user token
export const verifytoken = (req, res, next) => {
    const token = req.cookies.access_token; //get token from cookies

    if (!token) return next(errorHandler(401, "Unauthorized")); //if token not found, return error

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return next(errorHandler(403, "Forbidden")); //if token is invalid, return error
        req.user = user; //set user to request
        next(); //next middleware
    }) //verify token
    
};