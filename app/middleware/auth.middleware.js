const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeaders = req.headers['authorization'];
    const token = authHeaders && authHeaders.split(' ')[1];
    if(token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, result) => {
        if(err) res.sendStatus(403);
        req.user = result;
        next();
    })
}

module.exports = {authenticateToken};