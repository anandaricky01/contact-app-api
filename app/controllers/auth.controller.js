module.exports = (app) => {
  const router = require("express").Router();
  const jwt = require("jsonwebtoken");
  const bcrypt = require("bcrypt");
  const { guest } = require("../middleware/auth.middleware");
  const db = require("../models");
  const User = db.users;
  const {validationResult, check } = require("express-validator");
  require("dotenv").config();

  const generateAccessToken = (user) => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "5m" });
  };

  router.post("/login", guest, async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const checkUser = await User.findOne({email:email});
    if(!checkUser) return res.status(401).send({message:'User or Password is Incorrect!'});
    
    const checkPassword = await bcrypt.compare(password, checkUser.password);
    if(checkPassword == false) return res.status(401).send({message:'User or Password is Incorrect!'});
    
    const user = {
      email,
      password,
    };

    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    res.json({ accessToken, refreshToken });
  });

  router.post("/register", guest,
    [
        check("email")
            .isEmail()
            .withMessage("Use Valid Email!"), 
        check("password")
            .isLength({ min: 7 })
            .withMessage('must be at least 7 chars long')
    ],
    async (req, res) => {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const email = req.body.email;
      const password = await bcrypt.hash(req.body.password, 10);
      const name = req.body.name;

      const checkUser = await User.findOne({ email: email });
      if (checkUser) {
        return res
          .send({
            message: "Duplicate user data found!",
            data: checkUser,
          })
          .status(409);
      }

      const user = new User({
        name: name,
        email: email,
        password: password
      });

      user
        .save(user)
        .then((result) => {
            res.send({
                message:"New User Registered!",
                result
            });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || "Some error while creating data!",
              });
        });
    }
  );

  app.use("/api/auth", router);
};
