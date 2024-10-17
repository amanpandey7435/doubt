const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError=require("../utils/ExpressError.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})
router.post("/signup",wrapAsync(async(req,res)=>{
    try{
        let{username,password,email}=req.body;
   const newUser= new User({email,username});
   const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err){
          return next(err);
        }
        req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
    })
   
    }
    catch(err){
        req.flash("error","Oops! user is already registered");
        res.redirect("/signup");
    }
    
}))
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
})
router.post("/login",saveRedirectUrl,passport.authenticate('local', { failureRedirect: '/login',failureFlash:true }),async(req,res)=>{
    req.flash("success","Welcome Back ");
  let  redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Logged Out");
        res.redirect("/listings");
    })
})
module.exports=router;
