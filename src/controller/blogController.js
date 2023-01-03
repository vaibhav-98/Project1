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
        res.status(500).send({status:false,msg:err.message})
    }
}







//==========================================================get blogs=================================




const getBlogsData = async function (req,res) {

    try {
          
      let combination = req.query 
      let {authorId,category, tags,subcategory } = combination
      let dataBlog = await blogsModel.find({$and: [{isDeleted:false, isPublished:true},combination] }) 
      if (dataBlog==0) {
              return res.status(404).send({ status:false, msg :"No Such Blog Found"})
      } else {
          return res.status(200).send({ data:dataBlog})
      }
      
    } catch (err) {
       res.status(500.).send({status:false, msg :err.message })
      
    }
  
  
  
  }
  
  
module.exports.createBlog = createBlog
module.exports.getBlogsData=getBlogsData