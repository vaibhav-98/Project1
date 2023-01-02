const authorModel=require("../models/authorModel")

//handler for create author
const createAuthor=async function(req,res){
    let data=req.body;
    if(Object.keys(data).length===0){
        return res.status(400).send({msg:"author's data is missing"})
    }
    let createdAuthor=await authorModel.create(data)
    res.status(201).send({msg:createdAuthor})
}
module.exports.createAuthor=createAuthor;