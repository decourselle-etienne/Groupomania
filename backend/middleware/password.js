const passwordSchema = require('../models/Password');


// vérification du mot de passe
module.exports = (req, res, next) => {
    if (!passwordSchema.validate(req.body.password)) {
        res.writeHead(400, 'Le mot de passe doit contenir: \n9 caractères minimum \n1 Majuscule \n1 minuscule \n1 chiffre \n1 caractère spécial', {
            'content-type': 'application/json'
        });
        res.end('Format de mot de passe incorrect');
    } else {
        next();
    }
};