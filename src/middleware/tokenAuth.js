const jwt = require("jsonwebtoken")

const authentication = function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        if (!token) {
            return res.status(400).send({ status: false, Error: "authentication error" })
        }
        try {
            let decodedToken = jwt.verify(token, "vagaProject1")
            next();
        }
        catch (err) {
            return res.status(400).send({ status: false, msg: "invalid token" })
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports.authentication = authentication;