const express = require('express');
require('dotenv').config();

const routes = require('./routes/index');
const { port, verb, host } = require('./config/config.json').api[process.env.NODE_ENV];
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.listen(port, () => {
  console.log(`Acesse ${host}:${port} para ver a documentação da API`);
  console.log(`API rodando em modo de ${verb}`)
});