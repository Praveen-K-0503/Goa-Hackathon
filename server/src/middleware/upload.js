const multer = require('multer');

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/heic',
  'image/heif',
  'image/webp',
];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024, // 20 MB
  },
  fileFilter: (req, file, cb) => {
    const mime = file.mimetype.toLowerCase();
    const ext = file.originalname.split('.').pop().toLowerCase();
    const allowedExts = ['jpg', 'jpeg', 'png', 'heic', 'heif', 'webp'];

    if (ALLOWED_TYPES.includes(mime) || allowedExts.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload JPG, PNG, or HEIC.'), false);
    }
  },
});

module.exports = upload;
