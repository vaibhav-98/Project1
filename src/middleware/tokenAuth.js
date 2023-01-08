const mongoose = require("mongoose")
const jwt = require("jsonwebtoken");
const blogsModel = require("../models/blogsModel");
const ObjectId = mongoose.Types.ObjectId

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, Error: "authentication error" })
        }
        jwt.verify(token, "vagaProject1",(err,decodedToken)=>{
            if(err){
                return res.status(400).send({status:false,msg:"authentication failed - invalid token"})
            }
            else{
                req.headers["loggedUserId"] = decodedToken.user
                next();
            }
        })
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

const authorization = async function (req, res, next) {
    try {
        loggedUserId = req.headers["loggedUserId"]
        if (Object.keys(req.params).length != 0) {
            let blogId = req.params.blogsId;
            if (!ObjectId.isValid(blogId)) {
                return res.status(400).send({ status: false, msg: "invalid blogId format" })
            }
            let blogsData = await blogsModel.findOne({ _id: blogId })
            if (!blogsData) {
                return res.status(404).send({ status: false, msg: "no data found" })
            }
            let authorId = blogsData.authorId
            if (authorId != loggedUserId) {
                return res.status(403).send({ status: false, msg: "you are not authorized" })
            }
        }
        if (req.query.authorId) {
            if (req.query.authorId != loggedUserId) {
                return res.status(403).send({ status: false, msg: "you are not authorized" })
            }
        }
        next();
    }
    catch(err){
        return res.status(500).send({status:false,msg:err.message})
    }
}





module.exports.authentication = authentication;
module.exports.authorization = authorization;