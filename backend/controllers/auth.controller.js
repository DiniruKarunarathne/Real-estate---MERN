import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs'; //import bcryptjs (encrypt password)
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken'; //import jsonwebtoken (create token)

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


export const signin = async (req, res, next) => {
    const { email, password } = req.body; // Get data from frontend
  
    try {
      const validUser = await User.findOne({ email }); // Find user by email
      if (!validUser) return next(errorHandler(404, 'User not found'));
  
      const validPassword = bcryptjs.compareSync(password, validUser.password);
      if (!validPassword) return next(errorHandler(400, 'Wrong credentials!'));
  
      // Create the token first:


      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);


      const { password: pass, ...rest } = validUser._doc; // Get user info without password
  
      res
        .cookie('access_token', token, { httpOnly: true }) // Set cookie after creating token
        .status(200)
        .json(rest);   // Send user data
    } catch (error) {
      next(error);
    }
  };
  