const pg = require('../db/postgres');
const { formatDate, validateErr, validateQuery } = require('../helper/functions');

async function getVendasByDate({ date, shop }) {
  try {
    const nd = formatDate(date);

    const dateErrors = validateErr(nd);

    if(dateErrors) return { err: dateErrors };

    const client = await pg(shop);

    const dbErrors = validateErr(client);

    if(dbErrors) return { err: dbErrors };

    const { rows: qtdVendas } = await client.query(`
      SELECT COUNT(DISTINCT a.cr30codneg) AS "qtdVendas" FROM cr16t a, cr16t1 b WHERE 
      ((a.cr02codfil = b.cr02codfil) AND (a.cr09codpro = b.cr09codpro) AND (a.cr16pedido = b.cr16pedido)) AND 
      a.cr16datped = '${nd}' AND a.cr02codfil = ${shop < 10 ? `0${shop}`: shop} AND a.cr16status = 'F' GROUP BY a.cr02codfil ORDER BY a.cr02codfil;`);

    const { rows: vlrVendido } = await client.query(`
      SELECT SUM((((b.cr16qtdped * b.cr16vlruni) - cr16dscite ) + cr16acrite)) AS "vlrVendido" FROM cr16t a, cr16t1 b WHERE 
      ((a.cr02codfil = b.cr02codfil) AND (a.cr09codpro = b.cr09codpro) AND (a.cr16pedido = b.cr16pedido)) AND
      a.cr16datped = '${nd}' AND a.cr02codfil = ${shop < 10 ? `0${shop}`: shop} AND a.cr16status = 'F' GROUP BY a.cr02codfil ORDER BY a.cr02codfil`);

    const { rows: eg } = await client.query(`
      SELECT SUM(cr16vlreg) AS "eg" FROM cr16t a, cr16t1 b WHERE 
      ((a.cr02codfil = b.cr02codfil) AND (a.cr09codpro = b.cr09codpro) AND (a.cr16pedido = b.cr16pedido)) AND 
      a.cr16datped = '${nd}' AND a.cr02codfil = ${shop < 10 ? `0${shop}`: shop} AND a.cr16status = 'F' GROUP BY a.cr02codfil ORDER BY a.cr02codfil`);

    client.release();

    return {
      filial: shop,
      data: nd,
      ...validateQuery(qtdVendas[0]),
      ...validateQuery(vlrVendido[0]),
      ...validateQuery(eg[0])
    };
  } catch (error) {
    return { err: `Erro ao consultar o banco de dados, filial ${shop}` }
  };
};

module.exports = { getVendasByDate };