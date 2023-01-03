const express=require("express");
const router=express.Router();
const authorController=require("../controller/authorController")
const blogController = require("../controller/blogController")

//create author
router.post("/authors",authorController.createAuthor)

// CREATING BLOGS

router.post("/blogs",blogController.createBlog)

//======================================================get API========================

router.get("/blogs", blogController.getBlogsData)


//  API ===>  Delete blog by id

router.delete("/blogs/:blogId",blogController.deleteBlog)









module.exports=router;