function formatDate(date) {
  if(!date || date.length < 8) return { err: 'Data inválida ou não informada' };
  if(Date.parse(date) > Date.now()) return { err: 'Data maior que a permitida' };

  if(!isNaN(Date.parse(date))) {
    const nd = new Date(date);

    return `${nd.getUTCDate()}/${nd.getUTCMonth() + 1}/${nd.getUTCFullYear()}`
  }
};

function validateErr(obj) {
  if(obj.err && obj.err.length > 0) return obj.err;
  return false;
};

function validateQuery(data) {
  if(!data) return null;

  return data;
};

module.exports = { formatDate, validateErr, validateQuery };