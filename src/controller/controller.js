// DELETE /blogs?queryParams
// Delete blog documents by category, authorid, tag name, subcategory name, unpublished
// If the blog document doesn't exist then return an HTTP status of 404 with a body like this
const { model } = require("mongoose")
const blogsModel = require("../models/blogsModel")

const deleteBlog = async function (req, res) {

  let blogData = req.query
  // let {authorId, category, tags, subcategory,isPublished } = blogData

  //   if (isPublished == true)
  //   res.send({status: false, msg: "can't delete publised blog"})
  if (Object.keys(blogData) == 0)
    res.send({ status: false, msg: "No data given" })

    let toDelete = await blogsModel.findOneAndUpdate(blogData, { isDeleted: true }, { new: true })
  console.log(blogData)
  res.send({ status: true, data: toDelete })

}

module.exports.deleteBlog = deleteBlog


