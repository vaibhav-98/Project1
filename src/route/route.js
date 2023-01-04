const express=require("express");
const router=express.Router();
const authorController=require("../controller/authorController")
const blogController = require("../controller/blogController")
const MW=require("../middleware/tokenAuth")

//=============================================================create author API=======================
router.post("/authors",authorController.createAuthor)

//============================================================== CREATING BLOGS API====================================

router.post("/blogs",MW.authentication,blogController.createBlog)

//======================================================get API========================

router.get("/blogs",MW.authentication, blogController.getBlogsData)


//========================================== Update API =========================================

router.put("/blogs/:blogsId",MW.authentication, blogController.updateBlog)

//========================================================== Delete blog by id===================================

router.delete("/blogs/:blogId",MW.authentication,blogController.deleteBlog)

//========================================================== Delete blog by query===================================

router.delete("/blogs",MW.authentication,blogController.deleteBlogByQuery)


//==========================================================login===================================================

router.post("/login",authorController.authLogin)



 



module.exports=router;
