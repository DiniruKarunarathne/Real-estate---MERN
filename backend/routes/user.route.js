import express from "express";
import { updateUser } from "../controllers/user.controller.js";
import { verifytoken } from "../utils/verifyUser.js";

const router = express.Router();



router.post('/update/:id' ,verifytoken,  updateUser);

export default router;