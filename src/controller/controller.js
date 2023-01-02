const blogsModel = require("../models/blogsModel")

const updateBlog = async function (req, res) {
    let newData = req.body
    let updateBlog = await blogsModel.findOneAndUpdate(
        { _id: authorId },
        newData,
        { new: true })

    res.send({ status: true, data: updateBlog })


}