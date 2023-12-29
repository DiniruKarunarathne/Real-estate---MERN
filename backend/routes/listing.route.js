import express from "express";
import { createListing , deleteListing, updateListing} from "../controllers/listing.controller.js";
import { verifytoken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create" , verifytoken, createListing);
router.delete('/delete/:id', verifytoken, deleteListing);
router.post('/update/:id', verifytoken, updateListing);

export default router;