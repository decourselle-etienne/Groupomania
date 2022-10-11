const mongoose = require('mongoose');

const cardSchema = mongoose.Schema({
    userId: { type: String, required: true },
    prenom: { type: String, required: true },
    nom: { type: String, required: true },
    content: { type: String, required: true },
    imageUrl: { type: String, required: false },
    likes: { type: Number, required: false },
    usersLiked: { type: [String], required: false },
    createdDate: { type: Date, required: true }
});

module.exports = mongoose.model('card', cardSchema);