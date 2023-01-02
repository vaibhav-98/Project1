const express=require("express");
const router=express.Router();
const authorController=require("../controller/authorController")

//create author
router.post("/authors",authorController.createAuthor)











module.exports=router;