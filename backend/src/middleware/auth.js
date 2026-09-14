const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = require('../config');
const User = require('../models/User');

function readToken(req) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    return jwt.verify(token, JWT_SECRET_KEY);
  } catch {
    return null;
  }
}

// Equivalent of @jwt_required()
function jwtRequired(req, res, next) {
  const payload = readToken(req);
  if (!payload) {
    return res.status(401).json({ message: 'Missing or invalid token' });
  }
  req.userId = payload.sub;
  next();
}

// Equivalent of verify_jwt_in_request(optional=True)
function jwtOptional(req, _res, next) {
  const payload = readToken(req);
  req.userId = payload ? payload.sub : null;
  next();
}

// Equivalent of @role_required(*roles)
function roleRequired(...roles) {
  return async (req, res, next) => {
    const payload = readToken(req);
    if (!payload) {
      return res.status(401).json({ message: 'Missing or invalid token' });
    }
    req.userId = payload.sub;
    const user = await User.findById(req.userId);
    if (!user || !roles.includes(user.role)) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.currentUser = user;
    next();
  };
}

module.exports = { jwtRequired, jwtOptional, roleRequired };
