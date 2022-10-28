module.exports = (app) => {
    const contacts = require('../controllers/contact.controller');
    const router = require('express').Router();

    router.get('/', contacts.findAll);
    router.post('/', contacts.create);

    app.use('/api/contacts', router);
}