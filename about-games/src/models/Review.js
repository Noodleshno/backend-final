const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    content: {
        type: String,
        required: true,
    },

    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },

    game: {
        type: String,
        required: true,
        trim: true
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, { timestamps: true }
);

module.exports = mongoose.model('Review', reviewSchema);