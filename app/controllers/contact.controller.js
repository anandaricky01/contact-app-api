const db = require("../models");

const Contact = db.contacts;

exports.findAll = (req, res) => {
  Contact.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error while retrieving data!",
      });
    });
};

exports.create = (req, res) => {
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
};
