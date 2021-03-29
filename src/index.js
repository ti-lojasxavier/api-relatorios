const express = require('express');
require('dotenv').config();

const routes = require('./routes/index');
const { port, verb, host } = require('./config/config.json').api[process.env.NODE_ENV];
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.get('/', (req, res) => {
  res.status(200).send({
    vendasByDate: {
      path: '/vendas/:shop/:date',
      method: 'GET',
      params: {
        shop: 'Filial a ser utilizada como parâmetro na consulta, padrão NN',
        date: 'Data a ser utilizada como parâmetro na consulta, padrão "YYYY-MM-DD"'
      },
      return: {
        filial: 'Filial utilizada como parâmetro na consulta, NUMBER',
        data: 'Data utilizada como parâmetro na consulta, STRING',
        qtdVendas: '"OPCIONAL" Quantidade de vendas efetuadas, se nenhuma venda efetuada não será retornado, STRING / NULL',
        vlrVendido: '"OPCIONAL" Somatória dos valores de todas as vendas efetuadas, se nenhuma venda efetuada não será retornado, STRING / NULL',
        eg: '"OPCIONAL", Somatória dos valores de Extensão de Garantia, se nenhuma venda com extensão for efetuada não será retornado, STRING / NULL'
      }
    },
    getPat: {
      path: '/pat/:page/:itemsPerPage',
      mathod: 'POST',
      params: {
        page: 'Controle de paginação, padrão NN',
        itemsPerPage: 'Quantidade de items listados por página, padrão NN'
      },
      body: {
        shop: 'Filial a ser utilizada como parâmetro na consulta, padrão NN',
        pat: 'Número do PAT a ser utilizado como parâmetro na consulta, padrão NNNNN',
        codCli: 'Código do cliente a ser utilizado como parâmetro na consulta, padrão NNNNNNNNNNNNN',
        nomeCli: 'Nome do cliente a ser utilizado como parâmetro na consulta, padrão "AAAAAAA AAAAAAAA AAAAAAAAAAAAAAAA AAAAAA"',
        codProd: 'Código e variação do produto a ser utilizado como parâmetro na consulta, padrão "AAAAA-A"',
        emission: 'Data de emissão do PAT a ser utilizado como parâmetro na consulta, padrão\'2011-11-11\'',
        sent: 'Data de envio do PAT a ser utilizado como parâmetro na consulta, padrão\'2011-11-11\'',
        close: 'Data de baixa do PAT a ser utilizado como parâmetro na consulta, padrão\'2011-11-11\''
      },
      return: {
        count: {
          qtdPats: 'Contagem de linhas retornadas da consulta, STRING'
        },
        pats: [
          {
            filial: 'Filial resultante da consulta, NUMBER',
            pat: 'Número do PAT resultante da consulta, NUMBER',
            codCliente: 'Código do cliente resultante da consulta, STRING',
            nomeCliente: 'Nome do cliente resultante da consulta, STRING',
            codProduto: 'Código do produto resultante da consulta, STRING',
            descProduto: 'Descrição do produto resultante da consulta, STRING',
            defeito: 'Defeito relatado pelo solicitante do PAT (Cliente) resultante da consulta, STRING',
            nfRemessa: 'Número de nota fiscal de remessa resultante da consulta, NUMBER',
            emissao: 'Data de emissão do PAT resultante da consulta, STRING',
            enviado: 'Data de envio do PAT resultante da consulta, STRING',
            baixa: 'Data de baixa do PAT resultante da consulta, STRING'
          }
        ]
      }
    }
  })
});

app.listen(port, () => {
  console.log(`Acesse ${host}:${port} para ver a documentação da API`);
  console.log(`API rodando em modo de ${verb}`)
});