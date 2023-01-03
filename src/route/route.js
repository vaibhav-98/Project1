const express=require("express");
const router=express.Router();
const authorController=require("../controller/authorController")
const blogController = require("../controller/blogController")

//=============================================================create author API=======================
router.post("/authors",authorController.createAuthor)

//============================================================== CREATING BLOGS API====================================

router.post("/blogs",blogController.createBlog)

//======================================================get API========================

router.get("/blogs", blogController.getBlogsData)


//========================================== Update API =========================================

router.put("/blogs/:blogsId", blogController.updateBlog)

//========================================================== Delete blog by id===================================

router.delete("/blogs/:blogId",blogController.deleteBlog)

//========================================================== Delete blog by query===================================

router.delete("/blogs",blogController.deleteBlogByQuery)





 



module.exports=router;
