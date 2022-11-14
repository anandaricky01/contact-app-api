module.exports = (app) => {
  const router = require("express").Router();
  const {authenticateToken} = require('../middleware/auth.middleware');
  const db = require("../models");
  const { body, validationResult } = require("express-validator");
  const Contact = db.contacts;
  const Redis = require('redis');

  const redisClient = Redis.createClient();

  // constanta
  const DEFAULT_EXP = 3600;

  // get all data
  router.get("/", (req, res) => {
    Contact.find()
      .then(async (result) => {
        res.send({
          totalData: await Contact.countDocuments(),
          data: result,
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error while retrieving data!",
        });
      });
  });

  // get specific data by id
  router.get("/:_id", (req, res) => {
    Contact.findOne({
      _id: req.params._id,
    })
      .then((result) => {
        console.log("result : ", result);
        redisClient.get(`datas:${result._id}`, (err, datas) => {
          if(err) console.log(err)
          if(datas != null) {
            console.log(datas);
            return res.send(JSON.parse(datas));
          } else {
            redisClient.setex(`datas:${result._id}`, DEFAULT_EXP, JSON.stringify(result));
            return res.send(result);
          }
        });
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "couldn't find any data!",
        });
      });
  });

  // store data
  router.post("/", authenticateToken ,body("phone").isMobilePhone(), async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const checkContact = await Contact.findOne({ phone: req.body.phone });
    if (checkContact) {
      return res
        .send({
          message: "Duplicate data found!",
          data: checkContact,
        })
        .status(409);
    }

    const contact = new Contact({
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address ? req.body.address : false,
    });

    contact
      .save(contact)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error while creating data!",
        });
      });
  });

  // edit exist data
  router.put("/:_id", authenticateToken, body("phone").isMobilePhone(), async (req, res) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const filter = {
      _id: req.params._id,
    };

    const update = {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
    };

    Contact.findOneAndUpdate(filter, update)
      .then(() => {
        console.log("Data has been updated!");
        res.send("Data has been updated!");
      })
      .catch((err) => {
        res.status(500).send({
          message: err.message || "Some error while updating data!",
        });
      });
  });

  // delete data
  router.delete("/:_id", authenticateToken, (req, res) => {
    Contact.deleteOne({ _id: req.params._id })
      .then((result) => {
        console.log(result);
        res.send("Data has been deleted!");
      })
      .catch((err) => {
        res.status(400).send({
          message: err || "Some error while deleting data!",
        });
      });
  });

  app.use("/api/contacts", router);
};
