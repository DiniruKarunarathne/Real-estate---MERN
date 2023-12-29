import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async(req,res,next) => {
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing); // 201: Created successfully 
    } catch (error) {
        next(error);
    }
};

export const deleteListing = async(req, res , next)=>{
    const listing = await Listing.findById(req.params.id); // req.params.id is the id of the listing to be deleted

    // If listing is not found
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    

    // If the user is not the owner of the listing
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'Unauthorized'));
    }


    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json( 'Listing deleted successfully');
    } catch (error) {
        next(error);
    }
}


