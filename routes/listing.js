    const express=require("express");
    const router=express.Router();
// wrapAsync
let wrapAsync=require("../utils/wrapAsync.js");
let ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn}=require("../middleware.js");
// joi
const {listingSchema}=require("../schema.js");
// function for joi
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
    
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
}
// models require
const Listing=require("../models/listing.js");
// home route
router.get("/",wrapAsync(async(req,res)=>{
    const listings=await Listing.find({});
    res.render("./listings/index.ejs",{listings});
}))
// create route
router.get("/new",isLoggedIn,(req,res)=>{
    console.log(req.user);
    
    res.render("./listings/new.ejs");
})
router.post("/",isLoggedIn,wrapAsync(async(req,res,next)=>{
   
    let newListing=new Listing(req.body.listing);

    await newListing.save();
    req.flash("success","New Listing Was Created");
    res.redirect("/listings");
}));
// edit route
router.get("/:id/edit",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Oops Listing is not available");
        res.redirect("/listings");
    }
    res.render("./listings/edit.ejs",{listing});
}))
router.put("/:id",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    console.log(listing);
    req.flash("success","Listing successfully updated");
    res.redirect(`/listings/${id}`);
}))
// show route
router.get("/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Oops Listing is not available");
        res.redirect("/listings");
    }
    res.render("./listings/show.ejs",{listing});
}))
// delete route
router.delete("/:id",isLoggedIn,wrapAsync(async (req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findByIdAndDelete(id);
    req.flash("success","Listing was deleted");
    console.log(listing);
    res.redirect("/listings");
}))
module.exports=router;



