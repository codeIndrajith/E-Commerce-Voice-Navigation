const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
    },
    shipingLocations: {
      type: Array,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    condition: {
      type: String,
      required: false,
    },
    price: {
      type: Number,
      required: true,
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { versionKey: false }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
