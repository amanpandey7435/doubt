const express=require("express");
const router=express.Router({mergeParams:true});
// wrapAsync
let wrapAsync=require("../utils/wrapAsync.js");
let ExpressError=require("../utils/ExpressError.js");
// joi
const {reviewSchema}=require("../schema.js");
// require review
const Review=require("../models/reviews.js");
// models require
const Listing=require("../models/listing.js");
// validate
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
// add review route
router.post("/",validateReview,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();   
    console.log("Review saved");
    req.flash("success","Review was saved");
   res.redirect(`/listings/${id}`);
  
}))
// review delete route
router.delete("/:reviewId",wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
   await  Review.findByIdAndDelete(reviewId);
   req.flash("success","Review was deleted");
    res.redirect(`/listings/${id}`);
    
}))

module.exports=router;