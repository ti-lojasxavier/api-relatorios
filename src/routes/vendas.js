const routes = require('express').Router();
const { vendasByDate } = require('../controllers/vendas');

routes.get('/:shop/:date', vendasByDate);

module.exports = routes