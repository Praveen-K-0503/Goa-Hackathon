const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const {
  generateCard,
  getCard,
  getCardOG,
  trackDownload,
} = require('../controllers/card.controller');

// Generate card or team banner (supports single file 'photo' or array 'photos')
router.post('/generate', upload.any(), generateCard);

// Get card data (JSON)
router.get('/card/:id', getCard);

// OG meta page (HTML — for Twitter link preview)
router.get('/og/:id', getCardOG);

// Track download event
router.patch('/card/:id/download', trackDownload);

module.exports = router;
