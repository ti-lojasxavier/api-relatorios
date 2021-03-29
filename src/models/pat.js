const { connect: pg } = require('../db/postgres');
const { validateErr } = require('../helper/functions');

async function getPats({ shop, pat, codCli, nomeCli, codProd, emission, sent, close }, page, itemsPerPage) {
  try {
    const client = await pg(40);
    const clientErrors = validateErr(client);

    if(clientErrors) return { err: clientErrors };

    let queryText = '';

    for (const { value, label, query } of [shop, pat, codCli, nomeCli, codProd, emission, sent, close]) {
      if(value) {
        if(queryText.length > 0) queryText = `${queryText} AND `; 

        switch (label) {
          case 'shop':
            queryText = `${queryText}${query} = ${value}`;
            break;
          case 'pat':
            queryText = `${queryText}${query} = ${value}`;
            break;
          case 'codCli':
            queryText = `${queryText}${query} = ${value}`;
            break;
          case 'nomeCli':
            queryText = `${queryText}${query} LIKE '${value}%'`;
            break;
          case 'codProd':
            queryText = `${queryText}${query[0]} = ${value[0]} AND ${query[1]} = ${value[1]}`;
            break;
          case 'emission':
            queryText = `${queryText}${query} = '${value}'`;
            break;
          case 'sent':
            queryText = `${queryText}${query} = '${value}'`;
            break;
          case 'close':
            queryText = `${queryText}${query} = '${value}'`;
            break;
        }
      };
    };

    const { rows: count } = await client.query(`
      SELECT
      COUNT(P.cr61numpat) AS "qtdPats"
      FROM cr61t as P
      INNER JOIN cr08t C ON P.cr08codcli = C.cr08codcli
      INNER JOIN mt03t VP ON P.mt02codpro = VP.mt02codpro AND P.mt03varpro = VP.mt03varpro
      ${shop || pat || codCli || nomeCli || codProd || emission || sent || close ? `WHERE ${queryText}` : '' };
    `)
    
    const { rows: pats } = await client.query(`
      SELECT
      P.cr02codfil AS "filial",
      P.cr61numpat AS "pat",
      P.cr08codcli AS "codCliente",
      C.cr08nomcli AS "nomeCliente",
      concat(P.mt02codpro, '-', P.mt03varpro) AS "codProduto",
      VP.mt03despro AS "descProduto",
      P.cr61defeit AS "defeito",
      P.cr61notrem AS "nfRemessa",
      P.cr61datemi AS "emissao",
      P.cr61datenv AS "enviado",
      P.cr61datbai AS "baixa"
      FROM cr61t as P
      INNER JOIN cr08t C ON P.cr08codcli = C.cr08codcli
      INNER JOIN mt03t VP ON P.mt02codpro = VP.mt02codpro AND P.mt03varpro = VP.mt03varpro
      ${shop || pat || codCli || nomeCli || codProd || emission || sent || close ? `WHERE ${queryText}` : '' } 
      ORDER BY P.cr02codfil, P.cr61numpat
      LIMIT ${itemsPerPage} OFFSET ${(page - 1) * itemsPerPage};
    `);

    client.release();
    return { count: count[0], pats };
  } catch (error) {
    console.log(error)
    return { err: `Erro ao consultar o banco de dados` };
  }
};

module.exports = { getPats };