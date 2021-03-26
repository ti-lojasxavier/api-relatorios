const { getVendasByDate } = require('../models/vendas');

async function vendasByDate(req, res) {
  try {
    const { shop, date } = req.params;
    const result = await getVendasByDate({ date, shop: Number(shop) });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send({ err: 'Erro inesperado, tente novamente' });
  }
};

module.exports = { vendasByDate };