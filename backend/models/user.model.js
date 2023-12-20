import mongoose from "mongoose";

const userSchema = new mongoose.Schema({ 
    username: {
        type:String, 
        required:true, 
        unique:true
    },
    email: {
        type:String, 
        required:true, 
        unique:true
    },
    password: {
        type:String, 
        required:true
    },

 }, {timestamps:true}); // create a schema called userSchema with the following fields

const User = mongoose.model("User", userSchema);// create a model called User with the userSchema

export default User; 

