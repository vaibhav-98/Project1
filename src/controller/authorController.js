const authorModel = require("../models/authorModel")
const jwt=require("jsonwebtoken")
const validation=require("../validation/validate")

//handler for create author
const createAuthor = async function (req, res) {
    try {
        let data = req.body;

        const { fname, lname, title, email, password } = data;

        //body validation

        if (!fname || !lname || !title || !email || !password) {
            return res.status(400).send({ status: false, Error: "author's data is missing" })
        }

        //title validation
        if (title != "Mr" && title != "Mrs" && title != "Miss") {
            return res.status(400).send({ status: false, Error: "Invalid title - Title should be in [Mr / Mrs / Miss]" })
        }

        // email syntax validation
        if(!validation.isValidEmail(email)){
            res.status(400).send({status:false,Error:"INVALID EMAIL - Email should be in this format (abc@egf.com)"})
        }

        //email validation
        const findEmail = await authorModel.findOne({ email: email })
        if (findEmail) {
            return res.status(400).send({ status: false, Error: "Email already exist" })
        }

        //name validation
        if(!validation.validateName(fname) || !validation.validateName(lname)){
            return res.status(400).send({ status: false, Error: "INVALID Name - First name and last name should contain alphabets only. "})
        }

        //password validation
        if(!validation.checkPassword(password)){
            return res.status(400).send({ status: false, Error: "Required minimum 8 characters with combination of at least one special character(@,$,&,/,*), upper and lower case letters and a number" })
        }


        let createdAuthor = await authorModel.create(data)
        res.status(201).send({ status: true, msg: createdAuthor })
    }
    catch (err) {
        res.status(500).send({ status: false, Error: err.message })
    }
}

const authLogin = async function (req, res) {
    try {
        let data = req.body;
        const { email, password } = data;
        if (!email || !password) {
            return res.status(400).send({ status: false, Error: "Email and Password are required" })
        }
        let user = await authorModel.findOne({ email: email, password: password })
        if (!user) {
            return res.status(400).send({ status: false, Error: "Email or password is incorrect" })
        }
        let token = jwt.sign({ user: user._id.toString() }, "vagaProject1")
        return res.status(200).send({ status: true, msg: token })
    }
    catch(err){
        res.status(500).send({status:false,Error:err.message})
    }
}












module.exports.createAuthor = createAuthor;
module.exports.authLogin = authLogin;