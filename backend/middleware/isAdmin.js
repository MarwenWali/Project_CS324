const User = require('../models/User');

module.exports = async function (req, res, next) {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Not authenticated' });

    const user = await User.findById(userId).select('role');
    if (!user) return res.status(401).json({ error: 'User not found' });

    if (user.role !== 'admin') return res.status(403).json({ error: 'Admin access required' });

    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
