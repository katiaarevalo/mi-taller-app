const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret'; // Usa la misma clave secreta que en el archivo authRoutes.js

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.id;
    next();
  });
};

module.exports = { verifyToken };