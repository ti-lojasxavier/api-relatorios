const Router = require('express').Router();
const fs = require('fs');

fs.readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file.slice(-3) === '.js');
}).forEach(file => {
  file = file.slice(0, -3);

  if(file === 'index') return;

  Router.use(`/${file}`, require(`./${file}.js`));
})

module.exports = Router;