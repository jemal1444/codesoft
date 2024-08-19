const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    productId: mongoose.Schema.Types.ObjectId,
    quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Cart', cartSchema);
