const Review=require("./models/review.js")
const Listing=require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema}=require("./Schema.js");






module.exports.isLoggedIn=(req,res,next)=>{

if(!req.isAuthenticated()){
  // session me  redirectUrl name ka variable create kiya hai usme  orignalUrl ko store kiya hai 
 
  req.session.redirectUrl=req.originalUrl;
  console.log("  redirect url is ==" ,req.session.redirectUrl);
    req.flash("error","you must be logged before create Listing !");
 return  res.redirect("/login");
  }
  next();
};


module.exports.saveRedirectUrl=(req,res,next)=>{
  console.log( " in save redirect ",req.session.redirectUrl);
  if(req.session.redirectUrl){
      res.locals.redirectUrl=req.session.redirectUrl;
      console.log( " in res.locals me ",res.locals.redirectUrl);
  }

  if(!req.session.redirectUrl){
    console.log(" not redirectUrl");
  }
  next();
}


module.exports.isOwner=async(req,res,next)=>{
  let {id}=req.params;
  let listing=await Listing.findById(id);
if(!listing.owner.equals(res.locals.currUser._id)){
req.flash("error"," you are not the Owner");
return res.redirect(`/listings/${id}`);
}

next();
}

module.exports.validateListing=(req,res,next)=>{
  let {error}=listingSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    console.log(errMsg);
  throw new ExpressError(400,errMsg)
    
  }else{
    next();
  }
   
}

module.exports.validateReview=(req,res,next)=>{
  let {error}=reviewSchema.validate(req.body);
  if(error){
    let errMsg=error.details.map((el)=>el.message).join(",");
    console.log(errMsg);
  throw new ExpressError(400,errMsg)
    
  }else{
    next();
  }
   
}

module.exports.isReviewAuthor=async(req,res,next)=>{
  let {id,reviewId}=req.params;
  let review=await Review.findById(reviewId);
if(!review.author.equals(res.locals.currUser._id)){
req.flash("error"," you are not the Owner");
return res.redirect(`/listings/${id}`);
}
next();
};