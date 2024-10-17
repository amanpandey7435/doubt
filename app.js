const express=require("express");
const app=express();
const port=8080;
const methodOverride=require("method-override");
app.set("view engine","ejs");
const path=require("path");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static(path.join(__dirname,"public")));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.listen(port,()=>{
    console.log("Port is listening at ",port);  
})
app.get("/",(req,res)=>{
    res.send("First Page");
})
// require express-session
const session=require("express-session");
// ejs-mate
engine = require('ejs-mate');
app.engine('ejs', engine);
// mongoose
const mongoose = require('mongoose');

main().then(res=>console.log("Connection Successfully established")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/majorProject');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
// require passport
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const userRouter=require("./routes/user.js");

// require review.js from route
const reviewsRouter=require("./routes/review.js");
// require flash
const flash=require("connect-flash");
// sessions work
const sessionOption={
    secret:"mySecretCode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOny:true
    },
};
app.use(session(sessionOption));

app.use(flash());
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    
    res.locals.currUser=req.user;
   
    next();
})

// passport work
app.use(passport.initialize());

app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 

// creating demo user
// app.get("/demoUser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"xyz@gmail.com",
//         username:"Rahul"
//     })
//   let newUser=  await User.register(fakeUser,"helloWorld");
  
//   res.send(newUser);
// })

app.use("/",userRouter);















// require listing.js from router
const listingsRouter=require("./routes/listing.js");
app.use("/listings",listingsRouter);


app.use("/listings/:id/reviews",reviewsRouter);
// // all other routes
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
// // Error handling
app.use((err,req,res,next)=>{
    let {statusCode=400,message="Something-went wrong"}=err;
    // res.status(statusCode).render("error.ejs",{err});
    res.status(statusCode).send(message);
})
