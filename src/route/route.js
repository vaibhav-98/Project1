const express=require("express");
const router=express.Router();
const authorController=require("../controller/authorController")
const blogController = require("../controller/blogController")
const toDelete = require("../controller/controller")

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



router.put("/blogs", toDelete.deleteBlog)





 



module.exports=router;