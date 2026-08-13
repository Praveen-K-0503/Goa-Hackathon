const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  if (err.message === 'File too large') {
    return res.status(413).json({ error: 'File too large. Maximum size is 20MB.' });
  }

  if (err.message?.includes('Invalid file type')) {
    return res.status(400).json({ error: err.message });
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong. Please try again.',
  });
};

module.exports = errorHandler;
