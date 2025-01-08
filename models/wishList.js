// models/wishList.js

const mongoose = require('mongoose');
const wishListSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
});

module.exports = mongoose.model('WishList', wishListSchema);
