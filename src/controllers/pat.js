const { getPats } = require('../models/pat');
const { formatDate, validateErr } = require('../helper/functions');

async function getPat(req, res) {
  try {
    const { shop, pat, codCli, nomeCli, codProd, emission, sent, close } = req.body;
    const { page, itemsPerPage } = req.params;

    const nEmission = formatDate(emission);
    const emissionErrors = validateErr(nEmission);

    if(emission && emissionErrors) return { err: emissionErrors };

    const nSent = formatDate(sent);
    const sentErrors = validateErr(nSent);

    if(sent && sentErrors) return { err: sentErrors };

    const nClose = formatDate(close);
    const closeErrors = validateErr(nClose);

    if(close && closeErrors) return { err: closeErrors };

    const obj = new Object({
      shop: {
        label: 'shop',
        query: 'P.cr02codfil',
        value: shop
      },
      pat: {
        label: 'pat',
        query: 'P.cr61numpat',
        value: pat
      },
      codCli: {
        label: 'codCli',
        query: 'P.cr08codcli',
        value: codCli
      },
      nomeCli: {
        label: 'nomeCli',
        query: 'P.cr08nomcli',
        value: nomeCli
      },
      codProd: {
        label: 'codProd',
        query: ['P.mt02codpro','P.mt03varpro'],
        value: codProd ? codProd.split('-') : codProd
      },
      emission: {
        label: 'emission',
        query: 'P.cr61datemi',
        value: emission
      },
      sent: {
        label: 'sent',
        query: 'P.cr61datenv',
        value: sent
      },
      close: {
        label: 'close',
        query: 'P.cr61datbai',
        value: close
      }
    });

    const result = await getPats(obj, page, itemsPerPage);
    res.send(result);
  } catch (error) {
    res.status(500).send({ err: 'Erro inesperado, tente novamente' });
  };
};

module.exports = { getPat };