const ping = require('ping');

async function getActives(req, res) {
  try {
    const { servers } = require('../config/config.json').database.postgres;
    const actives = new Array;

    for (const server of servers) {
      const { alive } = await ping.promise.probe(server === 40 ? `192.168.${server}.253` : `192.168.${server}.254`);

      if(alive) actives.push(server);
    };

    res.status(200).send({ actives });
  } catch (error) {
    res.status(500).send({ err: 'Erro inesperado, tente novamente' });
  };
};


module.exports = { getActives };