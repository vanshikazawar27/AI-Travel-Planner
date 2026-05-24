const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing bearer token' });
  }

  const token = auth.slice('Bearer '.length);

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({ message: 'Server misconfiguration: missing JWT_SECRET' });
  }

  try {
    const payload = jwt.verify(token, secret);
    // payload: { userId, email }
    req.user = { userId: payload.userId, email: payload.email };
    return next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = { requireAuth };

