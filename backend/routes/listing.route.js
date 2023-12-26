import express from "express";
import { createListing } from "../controllers/listing.controller.js";
import { verifytoken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create" , verifytoken, createListing);

export default router;