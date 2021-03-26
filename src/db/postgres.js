const { Pool } = require('pg');
const ping = require('ping');

const { username, password, port, servers } = require('../config/config.json').database.postgres;

async function connect(filial) {
  if(!servers.includes(filial)) return { err: 'Filial não cadastrada' };

  const { alive } = await ping.promise.probe(filial === 40 ? `192.168.${filial}.253` : `192.168.${filial}.254`);

  if(!alive) return { err: 'Filial inacessível' };

  return new Pool({
    host: filial === 40 ? `192.168.${filial}.253` : `192.168.${filial}.254`,
    port: port,
    user: username,
    password: password,
    database: filial === 40 ? `xavier` : filial < 10 ? `loja0${filial}` : `loja${filial}`
  }).connect();
};

module.exports = connect;