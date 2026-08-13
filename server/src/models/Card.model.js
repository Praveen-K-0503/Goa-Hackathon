const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema(
  {
    cardId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    format: {
      type: String,
      enum: ['A', 'B'],
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    cloudinaryPublicId: {
      type: String,
      required: true,
    },
    // Format B fields
    name: { type: String, default: '' },
    role: { type: String, default: '' },
    stack: { type: String, default: '' },
    builderTitle: { type: String, default: '' },
    // Meta
    downloads: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Card', cardSchema);
