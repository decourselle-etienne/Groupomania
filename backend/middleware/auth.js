// récupération du package jsonwebtoken
const jwt = require('jsonwebtoken');
const card = require('../models/card');

module.exports = (req, res, next) => {

    try {

        // récupération du token dans le header, on récupère le 2e élement du tableau (split)
        const token = req.headers.authorization.split(' ')[1];
        // vérification du token décodé
        const decodeToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        // vérification de la combinaison token userId
        req.auth = decodeToken;

        if (req.auth.role === 'admin') {
            next()
        }
        else {
            next()
            // throw 'Identification incorrecte'
        }
    }
    catch (error) {
        res.status(401).json('Requête non autentifiée !');
    }
};