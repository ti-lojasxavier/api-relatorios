const routes = require('express').Router();
const { getPat } = require('../controllers/pat');

routes.post('/:page/:itemsPerPage', getPat);

module.exports = routes