const express=require("express");
const router=express.Router();
// Index route
router.get("/",(req,res)=>{
    res.send("This is /users route");
})
// show route
router.get("/:id",(req,res)=>{
    res.send("This is users/:id route");
})
// POSTS route
router.post("//:id",(req,res)=>{
    res.send("Post route is this");
})
// Delete route
router.delete("/:id",(req,res)=>{
    res.send("This is Delete route");
})
module.exports=router;