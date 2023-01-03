const mongoose = require("mongoose");
const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel")
const ObjectId = mongoose.Types.ObjectId


const createBlog = async function (req, res) {
    try {
        const { title, body, authorId, tags, category } = req.body;
        if (!title || !body || !authorId || !category) {
            return res.status(400).send({ status: false, msg: "missed some required details" })
        }
        if (!ObjectId.isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "invalid author id" })
        }

        let checkAuthor = await authorModel.findById(authorId)
        if (!checkAuthor) {
            return res.status(400).send({ status: false, msg: "author doesn't exists" })
        }
        const savedData = await blogsModel.create(req.body)
        res.status(201).send({ status: true, msg: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}







//==========================================================get blogs=================================




const getBlogsData = async function (req, res) {
    try {
        //taking query parameter
        const qparams = req.query;

        //checking if query parameter is present or not
        if (Object.keys(qparams).length == 0) {
            let data = await blogsModel.find({ isDeleted: false, isPublished: true })
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }

        //destructuring query parameter
        const { authorId, tags, category, subcategory } = qparams

        //checking authorId was given or not, if given then finding data
        if (authorId) {
            let data = await blogsModel.find({ isDeleted: false, isPublished: true, authorId: authorId })
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }


        //checking tags was given or not, if given then finding data
        if (tags) {
            let allblogs = await blogsModel.find({ isDeleted: false, isPublished: true })
            let data = allblogs.filter((blogDoc) => {
                let alltag = blogDoc.tags;
                return alltag.find(tag => tag == tags)
            })
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }

        //checking category was given or not, if given then finding data
        if (category) {
            let data = await blogsModel.find({ isDeleted: false, isPublished: true, category: category })
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }


        //checking subcategory was given or not, if given then finding data
        if (subcategory) {
            let allblogs = await blogsModel.find({ isDeleted: false, isPublished: true })
            let data = allblogs.filter((blogDoc) => {
                let allSubCategory = blogDoc.subcategory;
                return allSubCategory.find(subCat => subCat == subcategory)
            })
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }

        //if req-res cycle was not terminated it means data not found so giving error response
        return res.status(404).send({ status: false, msg: "No data found" })
    }
    catch(err){
        res.status(500).send({status:false,msg:"internal server error"})
    }
}




  //  API ===> Delete blogs by its id  ============================

  const deleteBlog = async function(req,res){
    const blogId = req.params.blogId

    //  checking format of id
    if(!ObjectId.isValid(blogId)){
       return res.status(400).send({status : false, msg : "ObjectId of blog is invalid"})
    }

    //   checking blog exists or not
    const findBlogId = await blogsModel.findById(blogId);
    if(!findBlogId){
       return res.status(404).send({msg : false, msg : "blog is not exists"})
    }

    const deleteById = await blogsModel.findOneAndUpdate({$and :[{_id : blogId} , {isDeleted : false}]},{$set : {isDeleted : true}})
    if(!deleteById){
        return res.status(404).send({status : false, msg : "document is already deleted"})
    }   
    res.status(200).send();
  }
  


module.exports.createBlog = createBlog
module.exports.getBlogsData = getBlogsData
module.exports.deleteBlog=deleteBlog