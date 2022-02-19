function cors(req, res) {
  res.header('Access-Control=Allow-Origin', '*');
  res.header('Access-Control=Allow-Origin', 'GET, PUT, PATCH, POST, DELETE');
  res.header('Access-Control=Allow-Origin', 'Content-Type');
  next();

};

module.exports = cors;
