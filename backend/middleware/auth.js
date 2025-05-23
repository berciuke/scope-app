const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req, res, next) {
  // token z headera
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ msg: 'Brak tokenu, autoryzacja odrzucona' });
  }

  try {
    const decoded = jwt.verify(token, config.get('jwtSecret'));
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token jest nieprawidłowy' });
  }
}; 