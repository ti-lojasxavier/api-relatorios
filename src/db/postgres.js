const { Pool } = require('pg');
const ping = require('ping');

const { username, password, port, servers } = require('../config/config.json').database.postgres;

async function connect(shop) {
  if(!servers.includes(shop)) return { err: 'Filial não cadastrada' };

  const { alive } = await ping.promise.probe(shop === 40 ? `192.168.${shop}.253` : `192.168.${shop}.254`);

  if(!alive) return { err: 'Filial inacessível' };

  return new Pool({
    host: shop === 40 ? `192.168.${shop}.253` : `192.168.${shop}.254`,
    port: port,
    user: username,
    password: password,
    database: shop === 40 ? `xavier` : shop < 10 ? `loja0${shop}` : `loja${shop}`
  }).connect();
};

module.exports = { connect };