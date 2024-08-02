const express=require("express");
const ExpressError = require("../utils/ExpressError.js");
const router=express.Router({mergeParams:true});
const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js")
const Review=require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const reviewController= require("../controllers/reviews.js");
const { destroyListing } = require("../controllers/listings.js");
// router
// {mergeParams:true}   use kiya because /listings/:d/reviews me id ko use karna hai isliye 

  // Reviews post  Route

router.post("/",
  isLoggedIn, validateReview,wrapAsync(reviewController.createReview) 
  )
  
  
  // delete review 
  router.delete("/:reviewId",
   isLoggedIn ,
   isReviewAuthor,
     wrapAsync(reviewController.destroyReview));

  module.exports=router;