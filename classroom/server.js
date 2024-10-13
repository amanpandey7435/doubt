const express=require("express");
const app=express();
const path=require("path");
app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");

app.listen(8080,()=>{
    console.log("Listening at port 3000");
})
const session=require("express-session");
const flash=require("connect-flash");
const sessionOptions=(
    {secret:"mysecretsupercode",resave:false,saveUninitialized:true}
)
app.use(session(sessionOptions));
app.use(flash());
app.get("/register",(req,res)=>{
    let {name="anonymous"}=req.query;
    req.session.name=name;
    if(name==="anonymous"){
        req.flash("error","Some thing error");
    }
    else
    req.flash("success","user registered successful");
   
    res.redirect("/hello");
})
app.get("/hello",(req,res)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.render("page.ejs",{name:req.session.name});
})


// app.get("/test",(req,res)=>{
//     res.send("Test successful");
// })
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`This page is called by ${req.session.count}`);
// })










































// app.use(cookieParser("secretCode"));
// const users=require("./routes/user.js");

// app.use("/users",users);
// app.get("/getcookies",(req,res)=>{
//     console.dir(req.cookies);
//     res.cookie("greet","Namaste");
//     res.send("This is cookie");
// })
// app.get("/greet",(req,res)=>{
//     let {name="Aman"}=req.cookies;
//     res.send(`Hi ${name}`);
// })
// app.get("/getsignedcookies",(req,res)=>{
//     res.cookie("made-in","Nepal",{signed:true});
//     res.send("Done");
// })
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("verified");
// })
// Express sessions
 