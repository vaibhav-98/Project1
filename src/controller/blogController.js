const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel")

const createBlog = async function(req,res){

    const data = req.body

    let authId = data.authorId
    let checkAuthor = await authorModel.findById(authId)
    if(!checkAuthor){
        return res.status(400).send({status : false, msg : "author doesn't exists"})
    }
    const savedData = await blogsModel.create(data)
    res.status(201).send({status : true, msg : savedData})
}

module.exports.createBlog = createBlog