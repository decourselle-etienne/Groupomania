// récupération du package jsonwebtoken
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try {
        // récupération du token dans le header, on récupère le 2e élement du tableau (split)
        const token = req.headers.authorization.split(' ')[1];
        // vérification du token décodé
        const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // vérification de la combinaison token userId
        const userId = decodeToken.userId;
        const role = decodeToken.role;
        if (role === 'admin') {
            next()
        }
        else if (req.body.userId === userId) {
            next();
        }
        else {
            throw 'Identification incorrecte'
        }
    }
    catch (error) {
        res.status(401).json('Requête non autentifiée !');
    }
};