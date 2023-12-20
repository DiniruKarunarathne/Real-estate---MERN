import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'; //import bcryptjs (encrypt password)

export const signup = async (req, res , next) => {
    const { username , email, password } = req.body; //get data from frontend
    const hashedPassword = bcryptjs.hashSync(password, 10); //encrypt password
    const newUser = new User({ username,email,password:hashedPassword}); //create new user
    try{
        await newUser.save();
        res.status(201).json('User create successfully');
    } catch(error){
        // res.status(500).json(error.message);
        next(error);
    }
     
}
