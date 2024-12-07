const jwt = require('jsonwebtoken');

const authMiddleware = (role) => {
  return (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(403).json({
        status: 'fail',
        message: 'No token provided',
      });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: 'fail',
          message: 'Invalid or expired token',
        });
      }

      // Kiểm tra quyền truy cập theo role
      if (role && decoded.role !== role) {
        return res.status(403).json({
          status: 'fail',
          message: 'Access denied',
        });
      }

      req.user = decoded;
      next();
    });
  };
};

module.exports = authMiddleware;
