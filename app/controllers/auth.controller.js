module.exports = (app) => {
    const router = require("express").Router();
    const jwt = require("jsonwebtoken");
    const bcrypt = require('bcrypt');
    const { authenticateToken } = require('../middleware/auth.middleware');
    require('dotenv').config();

    const users = {
        email : 'cikociko@gmail.com',
        password : '1234567'
    };

    const posts = [{
        username : 'ciko',
        email : users.email,
        title : 'post 1'
    },{
        username : 'ciko',
        email : users.email,
        title : 'post 2'
    }];

    router.post('/posts', authenticateToken, (req, res) => {
        res.json(posts);
    });

    router.post('/login', async (req, res) => {
        // res.json('Login Route');
        const email = req.body.email;
        // const password = await bcrypt.hash(req.body.password, 10);
        const password = req.body.password;
        const user = {
            email,
            password
        }

        if(user.email !== users.email && user.password !== users.password) return res.sendStatus(401);

        const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        res.json({accessToken});
    });

    router.post('/register', async (req, res) => {
        const email = req.body.email;
        const password = await bcrypt.hash(req.body.password, 10);
        const user = {
            email,
            password
        }

        res.json(user);
    });

    app.use("/api/auth", router); 
}