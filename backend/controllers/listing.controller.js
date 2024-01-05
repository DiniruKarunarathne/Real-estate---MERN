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

export const updateListing = async(req, res, next) => {
    const listing = await Listing.findById(req.params.id); // req.params.id is the id of the listing to be updated

    // If listing is not found
    if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
    }
    

    // If the user is not the owner of the listing
    if(req.user.id !== listing.userRef){
        return next(errorHandler(401, 'Unauthorized'));
    }

    try {
        const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        });
        res.status(200).json(updatedListing);
    } catch (error) {
        next(error);
    }
}

export const getListing = async (req, res, next) => {
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(listing);
    } 
    catch (error) {
      next(error);
    }
    
}

export const getListings = async(req, res , next) =>{
    try {
        const limit = parseInt(req.query.limit) || 9    // if limit is not provided, default is 9             
        const startIndex = parseInt(req.query.startIndex) || 0   // if startIndex is not provided, default is 0
        
        let offer = req.query.offer 

        if(offer === undefined || offer === 'false'){
            offer = { $in: [false , true]}  // if offer is not provided (undefined or false ), search for both true and false
        }

        let furnished = req.query.furnished

        if(furnished === undefined || furnished === 'false'){
            furnished = { $in: [false , true]}  
        }

        let parking = req.query.parking

        if(parking === undefined || parking === 'false'){
            parking = { $in: [false , true]}  
        }

        let type = req.query.type

        if(type === undefined || type === 'all'){
            type = { $in: ['sale' , 'rent']}  // if type is not provided (undefined or all ), search for both sale and rent
        }

        const searchTerm = req.query.searchTerm || '' ;
        const sort = req.query.sort || 'createdAt'    ; // if sort is not provided, default is createdAt
        const order = req.query.order || 'desc' ; 

    
        const listing = await Listing.find({
            name: { $regex: searchTerm, $options: 'i' },    // $regex: searchTerm means that the name of the listing should contain the searchTerm \\ $options: 'i' means that the search is case insensitive(uppercase or lowercase)
            offer,
            furnished,
            parking,
            type
        }).sort({ [sort]: order }).limit(limit).skip(startIndex); 

        res.status(200).json(listing);


    } catch (error) {
        next(error);
    }
}
    


