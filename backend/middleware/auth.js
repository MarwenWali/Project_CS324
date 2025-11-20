const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    console.error('❌ No token provided in Authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    // Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('✅ Token verified for user:', decoded.userId);
    
    // Attach user info to request object
    req.user = decoded;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    console.error('❌ Token verification failed:', error.message);
    res.status(401).json({ error: 'Invalid token' });
  }
};