const bcrypt = require('bcrypt');
const fs = require('file-system')
const jwt = require('jsonwebtoken');

const card = require('../models/card');
const User = require('../models/User');



// => création d'un nouvel utilisateur
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)

        .then(async hash => {
            let user = new User({
                email: req.body.email,
                password: hash,
                prenom: req.body.prenom,
                nom: req.body.nom,
                role: 'classic'
            });

            await user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(() => {
                    throw new Error('Erreur lors de la sauvegarde dans la BDD')
                });
        })
        .catch(error => res.status(500).json({ error }));
};

// => login d'un utilisateur déjà créé
exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {

            if (!user) {
                return res.status(401).json({ error: 'Utilisateur ou mot de passe invalide !' });
            }

            bcrypt.compare(req.body.password, user.password)
                .then(valid => {

                    if (!valid) {
                        return res.status(401).json({ error: 'Utilisateur ou mot de passe invalide !' });
                    }
                    res.status(200).json({
                        role: user.role,
                        prenom: user.prenom,
                        nom: user.nom,
                        userId: user._id,
                        token: jwt.sign(
                            {
                                userId: user._id,
                                role: user.role
                            },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: "24h" }
                        )
                    });
                })
                .catch(() => { throw new Error('Erreur lors de la création du Token') });
        })
        .catch(error => res.status(500).json({ error }));
};

// => suppression d'un profil
exports.deleteUser = (req, res, next) => {
    User.findOne({ userId: req.params.id })
        .then((user) => {
            // find all cards
            card.find({ userId: req.params.id })
                .then((card) => {
                    // delete user's images
                    let filename = card.imageUrl.split('/images/')[1];
                    fs.unlink(`images/${filename}`, () => {
                        // delete user's cards
                        delete card
                    })
                })
                .catch((error) => res.status(400).json({ error }))

            // delete user's likes;
            userLiked.find({ userId: req.params.id })
                .then((likes) => {
                    delete likes
                })

            // delete user
            delete user;
            res.status(200).json({ message: 'Profil et contenus liés supprimés' })
        })
        .catch(error => res.status(500).json({ error }));
};

// => afficher le profil
exports.User = (req, res, next) => {

    User.findOne()
        .then(user => {
            res.status(200).json(user)
        })
        .catch(error => res.status(400).json({ error }));
};
