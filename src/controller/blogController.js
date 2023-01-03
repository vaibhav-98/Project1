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

module.exports.createBlog = createBlog