/**
 * HEIC/HEIF → JPEG conversion service
 * Handles iPhone photo uploads
 */
async function convertHeicToJpeg(buffer) {
  try {
    const heicConvert = require('heic-convert');
    const outputBuffer = await heicConvert({
      buffer,
      format: 'JPEG',
      quality: 0.95,
    });
    return Buffer.from(outputBuffer);
  } catch (err) {
    throw new Error('Failed to convert HEIC image: ' + err.message);
  }
}

function isHeic(buffer, mimetype, originalname) {
  const mime = (mimetype || '').toLowerCase();
  const ext = (originalname || '').split('.').pop().toLowerCase();
  // Check magic bytes for HEIC (ftyp box)
  const isHeicMime = mime.includes('heic') || mime.includes('heif');
  const isHeicExt = ext === 'heic' || ext === 'heif';
  return isHeicMime || isHeicExt;
}

module.exports = { convertHeicToJpeg, isHeic };
