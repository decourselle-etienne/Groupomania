const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: { type: String, required: [true, 'email non valide'], unique: [true, 'email non valide'] },
    password: { type: String, required: true },
    role: { type: String, required: true, default: 'classic' },
    prenom: { type: String, required: true },
    nom: { type: String, required: true },

});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);