const authorModel = require("../models/authorModel")
const jwt=require("jsonwebtoken")

//handler for create author
const createAuthor = async function (req, res) {
    try {
        let data = req.body;

        const { fname, lname, title, email, password } = data;

        //body validation

        if (!fname || !lname || !title || !email || !password) {
            return res.status(400).send({ status: false, msg: "author's data is missing" })
        }

        //title validation
        if (title != "Mr" && title != "Mrs" && title != "Miss") {
            return res.status(400).send({ status: false, msg: "invalid title" })
        }

        //email validation
        const findEmail = await authorModel.findOne({ email: email })
        if (findEmail) {
            return res.status(400).send({ status: false, msg: "email already exist" })
        }

        let createdAuthor = await authorModel.create(data)
        res.status(201).send({ status: true, msg: createdAuthor })
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const authLogin = async function (req, res) {
    try {
        let data = req.body;
        const { email, password } = data;
        if (!email || !password) {
            return res.status(400).send({ status: false, msg: "invalid request" })
        }
        let user = await authorModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(400).send({ status: false, msg: "email or password is wrong" })
        }
        let token = jwt.sign({ user: user._id.toString() }, "vagaProject1")
        return res.status(200).send({ status: true, msg: token })
    }
    catch(err){
        res.status(500).send({status:false,msg:err.message})
    }
}












module.exports.createAuthor = createAuthor;
module.exports.authLogin = authLogin;