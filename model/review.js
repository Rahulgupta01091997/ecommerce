const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
    productID: { type: String, required: true },
    userID: { type: String, required: true },
    ip: { type: String },
    review: { type: String },
    rating: { type: String },
    timestamp: { type: String },
    isVerified: { type: String },
});

module.exports = mongoose.model("review", reviewSchema);