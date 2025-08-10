// backend/middleware/auth.js

const jwt = require('jsonwebtoken');

const SECRET_KEY = '7ccf67d0d95fd62371d7105df9d9cded64e2661d2bb1f38fe1d838b6fb0f4e9c'; // Use a mesma chave que você definiu em auth.js

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido.' });
    }
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
