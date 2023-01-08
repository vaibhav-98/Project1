const mongoose = require("mongoose");
const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel")
const ObjectId = mongoose.Types.ObjectId

//=============================================================create Blog API=============================
const createBlog = async function (req, res) {
    try {
        const { title, body, authorId, category, isPublished } = req.body;
        if (!title || !body || !authorId || !category) {
            return res.status(400).send({ status: false, msg: "missed some required details" })
        }
        if (!ObjectId.isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "invalid author id" })
        }

        if(req.headers.loggedUserId != authorId){
            return res.status(400).send({status:false,msg:"please provide your own author id not any another"})
        }

        let checkAuthor = await authorModel.findById(authorId)
        if (!checkAuthor) {
            return res.status(400).send({ status: false, msg: "author doesn't exists" })
        }
        if (isPublished) {
            req.body["publishedAt"] = Date.now()
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
            let data = await blogsModel.find({ isDeleted: false, isPublished: true }).populate("authorId", { fname: 1, lname: 1, title: 1, _id: 0 })
            if (data.length == 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }
        
        qparams.isDeleted=false
        qparams.isPublished=true
        let data = await blogsModel.find(qparams).populate("authorId", { fname: 1, lname: 1, title: 1, _id: 0 })
        if(data.length!=0){
            return res.status(200).send({status:true,msg:data})
        }
        return res.status(404).send({status:false,msg:"no data found"})
    }
    catch (err) {
        res.status(500).send({ status: false, msg: "internal server error" })
    }
}

//===========================================================PUT Blogs=========================


const updateBlog = async function (req, res) {
    try {

        let data = req.body
        let BlogId = req.params.blogsId



        //------------------------- Destructuring Data from Body -------------------------//
        let { title, body, tags, subcategory } = data

        //------------------------- Cheking Presence of BlogId -------------------------//
        if (!BlogId) return res.status(404).send({ status: false, msg: "Please input id BlogId." });

        //------------------------- Fetching BlogID from DB -------------------------//
        let checkBlogID = await blogsModel.findOne({ _id: BlogId })
        if (!checkBlogID) return res.status(404).send({ status: false, msg: "Please input valid BlogId." })


        //------------------------- Checking Required Field -------------------------//
        if (!(title || body || tags || subcategory)) {
            return res.status(400).send({ status: false, message: "Mandatory fields are required." });
        }

        //===================== Fetching Data with BlogId and Updating Document =====================//

        let blog = await blogsModel.findOneAndUpdate({ _id: BlogId }, {
            $push: { subcategory: subcategory, tags: tags },
            $set: { title: title, body: body, isPublished: true, publishedAt: Date.now() }
        }, { new: true })

        if (!blog) return res.status(404).send({ status: false, msg: "Blog not found." })

        res.status(200).send({ status: true, msg: "Successfully Updated ", data: blog })



    } catch (error) {

        res.status(500).send({ error: error.message })
    }

}




//  ========================================API ===> Delete blogs by its id  ============================

const deleteBlog = async function (req, res) {
    try {
        const blogId = req.params.blogsId

        //  checking format of id
        if (!ObjectId.isValid(blogId)) {
            return res.status(400).send({ status: false, msg: "blog id is invalid" })
        }

        //   checking blog exists or not
        const findBlogId = await blogsModel.findById(blogId);
        if (!findBlogId) {
            return res.status(404).send({ msg: false, msg: "blog is not exists" })
        }

        const deleteById = await blogsModel.findOneAndUpdate({ $and: [{ _id: blogId }, { isDeleted: false }] }, { $set: { isDeleted: true, deletedAt: Date.now() } })
        if (!deleteById) {
            return res.status(404).send({ status: false, msg: "no data found to be deleted" })
        }
        return res.status(200).send();
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

//========================================Delete Blog By Query Param=========================================

const deleteBlogByQuery = async function (req, res) {
    try {
        let loggedUserId = req.headers["loggedUserId"]
        let qparams=req.query;
        if(Object.keys(qparams).length==0){
            return res.status(400).send({status:false,msg:"please provide some query data"})
        }
        const {category, authorId, tags, subcategory,isPublished}=req.query;
        if(!(category || authorId || tags || subcategory || isPublished)){
            return res.status(400).send({status:false,msg:"please provide some necessary query data"})
        }
        if(!qparams.authorId){
            qparams.authorId=loggedUserId
        }
        qparams.isDeleted=false;
        let deletedData=await blogsModel.updateMany(qparams,{isDeleted:true})
        let deletedCount=deletedData.modifiedCount;
        if(deletedCount != 0){
            return res.status(200).send({status:true,msg:`deleted ${deletedCount} blog`})
        }
        
        return res.status(404).send({ status: false, msg: "no data is found to be deleted" })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}


module.exports.createBlog = createBlog
module.exports.getBlogsData = getBlogsData
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery