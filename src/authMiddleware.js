function apiKeyAuth(expectedKey) {
  return (req, res, next) => {
    const providedKey = req.header('x-api-key');
    if (!providedKey || providedKey !== expectedKey) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    return next();
  };
}

module.exports = { apiKeyAuth };
