const mongoose = require("mongoose");
const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel")
const ObjectId = mongoose.Types.ObjectId


const createBlog = async function (req, res) {
    try {
        const { title, body, authorId, category } = req.body;
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
            let data = await blogsModel.find({ isDeleted: false, isPublished:true }).populate("authorId",{fname:1,lname:1,title:1,_id:0})
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }

        //destructuring query parameter
        const { authorId, tags, category, subcategory } = qparams

        //checking authorId was given or not, if given then finding data
        if (authorId) {
            if(!ObjectId.isValid(authorId)){
                return res.status(400).send({status:false, Error:"Invalid author Id format"})

            }
            let data = await blogsModel.find({ isDeleted: false, isPublished: true, authorId: authorId }).populate("authorId",{fname:1,lname:1,title:1,_id:0})
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }


        //checking tags was given or not, if given then finding data
        if (tags) {
            let allblogs = await blogsModel.find({ isDeleted: false, isPublished: true }).populate("authorId",{fname:1,lname:1,title:1,_id:0})
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
            let data = await blogsModel.find({ isDeleted: false, isPublished: true, category: category }).populate("authorId",{fname:1,lname:1,title:1,_id:0})
            if (data.length != 0) {
                return res.status(200).send({ status: true, msg: data })
            }
        }


        //checking subcategory was given or not, if given then finding data
        if (subcategory) {
            let allblogs = await blogsModel.find({ isDeleted: false, isPublished: true }).populate("authorId",{fname:1,lname:1,title:1,_id:0})
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

        const deleteById = await blogsModel.findOneAndUpdate({ $and: [{ _id: blogId }, { isDeleted: false }] }, { $set: { isDeleted: true } })
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
        let loggedUserId=req.headers["loggedUserId"]
        const { category, authorId, tags, subcategory, isPublished } = req.query;
        if (category) {
            let deletedData = await blogsModel.updateMany({ category: category, isDeleted: false,authorId:loggedUserId }, { isDeleted: true });
            if (deletedData.modifiedCount != 0) {
                return res.status(200).send({ status: true, msg: "deleted successfully" })
            }
        }
        if (authorId) {
            if (!ObjectId.isValid(authorId)) {
                return res.status(400).send({ status: false, msg: "invalid author id" })
            }
            let deletedData = await blogsModel.updateMany({ authorId: authorId, isDeleted: false, }, { isDeleted: true });
            if (deletedData.modifiedCount != 0) {
                return res.status(200).send({ status: true, msg: "deleted successfully" })
            }
        }
        if (tags) {
            let findedData = await blogsModel.find({ isDeleted: false });
            let filteredData = findedData.filter((doc) => {
                let alltag = doc.tags;
                return alltag.find(tag => tag == tags)
            })
            let idArr = [];
            filteredData.forEach(doc => {
                idArr.push(doc._id)
            })
            let deletedData = await blogsModel.updateMany({ _id: { $in: idArr },authorId:loggedUserId }, { isDeleted: true })
            if (deletedData.modifiedCount != 0) {
                return res.status(200).send({ status: true, msg: "deleted successfully" })
            }
        }
        if (subcategory) {
            let findedData = await blogsModel.find({ isDeleted: false });
            let filteredData = findedData.filter((doc) => {
                let alltag = doc.subcategory;
                return alltag.find(subcat => subcat == subcategory)
            })
            let idArr = [];
            filteredData.forEach(doc => {
                idArr.push(doc._id)
            })
            let deletedData = await blogsModel.updateMany({ _id: { $in: idArr },authorId:loggedUserId}, { isDeleted: true })
            if (deletedData.modifiedCount != 0) {
                return res.status(200).send({ status: true, msg: "deleted successfully" })
            }
        }
        if (isPublished) {
            let deletedData = await blogsModel.updateMany({ isPublished: isPublished, isDeleted: false,authorId:loggedUserId}, { isDeleted: true });
            if (deletedData.modifiedCount != 0) {
                return res.status(200).send({ status: true, msg: "deleted successfully" })
            }
        }
        return res.status(404).send({ status: false, msg: "no data is found to be deleted" })
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}


module.exports.createBlog = createBlog
module.exports.getBlogsData = getBlogsData
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deleteBlogByQuery = deleteBlogByQuery