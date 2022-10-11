const passwordValidator = require('password-validator');

// Création d'un schéma de sécurité pour les mdp
const passwordSchema = new passwordValidator();

// liste de contraintes du mot de passe
passwordSchema
    // longueur minimale : 8 caractères
    .is().min(9)
    // doit contenir au moins une majuscule
    .has().uppercase()
    // doit contenir au moins une minuscule                           
    .has().lowercase()
    // doit contenir au moins un chiffre                           
    .has().digits()
    // doit contenir un caractère spécial
    .has().symbols()
    // ne contient pas d'espace
    .has().not().spaces()
    // Blacklist de valeurs à proscrire
    .is().not().oneOf(['Passw0rd', 'Password123', 'Azerty123', 'Qwerty123']);

module.exports = passwordSchema;