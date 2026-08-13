const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a PNG buffer to Cloudinary
 * @param {Buffer} buffer - PNG image buffer
 * @param {string} publicId - Unique public ID for the asset
 * @returns {{ url: string, publicId: string }}
 */
async function uploadToCloudinary(buffer, publicId) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: `hhgoa2026/${publicId}`,
        resource_type: 'image',
        format: 'png',
        overwrite: true,
        transformation: [{ quality: 'auto:best' }],
      },
      (error, result) => {
        if (error) {
          reject(new Error('Cloudinary upload failed: ' + error.message));
        } else {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );
    uploadStream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary
 */
async function deleteFromCloudinary(publicId) {
  return cloudinary.uploader.destroy(publicId);
}

module.exports = { uploadToCloudinary, deleteFromCloudinary };
