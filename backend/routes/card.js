const express = require('express');

const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const cardController = require('../controllers/card');

// Afficher tous les cards disponibles sur le Réseau Social
router.get('/', cardController.showcard);

// Afficher la card grâce à son ID
router.get('/:id', cardController.afficherCardById);

// Créer un card
router.post('/', multer, cardController.newcard);

// Modifier un card
router.put('/:id', auth, multer, cardController.modifycard);

// Supprimer un card
router.delete('/:id', auth, cardController.deletecard);

// Liker un card
router.post('/:id/like', cardController.likecard);

module.exports = router
