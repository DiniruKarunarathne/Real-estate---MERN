import express from "express";
import { createListing , deleteListing, updateListing, getListing , getListings} from "../controllers/listing.controller.js";
import { verifytoken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create" , verifytoken, createListing);
router.delete('/delete/:id', verifytoken, deleteListing);
router.post('/update/:id', verifytoken, updateListing);
router.get('/get/:id', getListing);
router.get('/get' , getListings)

export default router;