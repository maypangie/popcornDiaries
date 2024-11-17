const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
    title: String,
    posterPath: String,
    rating: { type: Number, default: 0 },
    userId: String
});

module.exports = mongoose.model('Movie', movieSchema);
