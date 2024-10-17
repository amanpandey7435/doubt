const mongoose = require('mongoose');

main().then(res=>console.log("Connection Successfully established")).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/majorProject');

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
const Listing=require("../models/listing.js");
const initData=require("./data.js");
const initDb=async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({...obj,owner:"670fff993c023bd172b6c2ca"}));
    await Listing.insertMany(initData.data).then(res=>console.log(res));
    console.log("Listing Was Initialized");

}
initDb();