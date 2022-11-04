const jwt = require("jsonwebtoken");
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
        console.log(err);
        if(err) res.sendStatus(403);
        req.user = result;
        next();
    })
}

const guest = (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if(token != null) {
        console.log(token);
        console.log(token == "undefined");
        return res.sendStatus(403);
    }
    next();
}

module.exports = {authenticateToken, guest};