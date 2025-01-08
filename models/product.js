// models/product.js

const mongoose = require('mongoose')
const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,

    // precision handling
    set: (value) => (value * 100),
    get: (value) => (value / 100).toFixed(2),
  },
  stockQuantity: {
    type: Number,
    required: true,
    min: [0, 'Stock cannot be negative']
  },
  categoryId: {
    type: mongoose.Schema.types.ObjectId,
    required: true,
    ref: 'Category',
  },
  sellerId: {
    type: mongoose.Schema.types.ObjectId,
    required: true,
    ref: 'User',
  },
  images: {
    type: [String], // file paths or URL to image resources
    required: true,
  },
  videos: {
    type: [String], // file paths or URL to video  resources
    required: false, // optional video resource
  },
}, { timestamps: true });

// -- STOCK MANAGEMENT METHODS ---

productSchema.methods.decreaseStock = async (quantity) => {
  if (this.stockQuantity >= quantity){
    this.stockQuantity -= quantity
    await this.save();
  } else {
    throw Error('Not enough stock available');
  }
}


productSchema.methods.increaseStock = async (quantity) => {
  this.stockQuantity += quantity;
  await this.save();
}

productSchema.methods.isInStock = (quantity) => {
  return this.stockQuantity >= quantity;
}

moudule.exports = new mongoose.model('Product', productSchema);
