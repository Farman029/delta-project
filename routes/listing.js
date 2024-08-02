const express=require("express");
const router=express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listings.js");

const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage }) 

// for storing file use multer
// dest-destination uploads is a folder  uploads folder automatic create ho ga   

router.route("/")
.get( wrapAsync(listingController.index))
.post(isLoggedIn, 
  validateListing,
upload.single('listing[image]'),
  wrapAsync(listingController.createListing)
)

// /New Route
  router.get("/new",isLoggedIn,listingController.renderNewForm);





router.route("/:id")
.get( wrapAsync(listingController.showListing))
.put(isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync( listingController.updateListing)

).delete(isLoggedIn,
  isOwner,
  wrapAsync( listingController.destroyListing));






  

  
  
  
  
  //Edit Route
  router.get("/:id/edit",isLoggedIn,wrapAsync(listingController.renderEditForm));
  
  
  module.exports=router;