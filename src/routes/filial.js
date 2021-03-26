const routes = require('express').Router();
const { getActives } = require('../controllers/filial');

routes.get('/', getActives);

module.exports = routes