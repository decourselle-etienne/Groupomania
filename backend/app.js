require('dotenv').config()

// Sécurité
const cors = require('cors');
const path = require('path')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const express = require('express');
const mongoose = require('mongoose');

const cardRouters = require('./routes/card');
const userRouters = require('./routes/users');

const app = express();

// éviter les erreurs de cors
app.use(cors());

// remplacer les $ par des _ pour éviter les injections SQL
app.use(mongoSanitize({ allowDots: true, replaceWith: '_', }),);

// limiter le nombre de demandes pour éviter les passage en force


const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 500,
    standardHeaders: true,
    legacyHeaders: false
})


// éviter les injection XLS
app.use(helmet({
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
}
));


// Connexion à la BDD
const mongoUser = process.env.USER;
const mongoPsw = process.env.PSW;


mongoose.connect(`mongodb+srv://Etienne:mx4IAZTnd03sofYE@groupomania-sn.awrekyt.mongodb.net/?retryWrites=true&w=majority`,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à la Base De Données réussie.'))
    .catch(() => console.log('Connexion à la Base De Donnée échouée.'));


app.use(limiter);
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'images')));


app.use('/api/cards', cardRouters);
app.use('/api/auth', userRouters);

module.exports = app;