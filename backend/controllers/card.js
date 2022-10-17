const card = require('../models/card');
const fs = require('file-system');
const User = require('../models/User');

exports.newcard = (req, res, next) => {
  //stockage des données envoyées par le front
  const cardObject = JSON.parse(req.body.card);

  if (req.file) {
    cardObject.imageUrl = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  else {
    cardObject.imageUrl = ''
  }

  let cards = new card({
    createdDate: cardObject.createdDate,
    content: cardObject.content,
    nom: cardObject.nom,
    prenom: cardObject.prenom,
    userId: cardObject.userId,
    imageUrl: cardObject.imageUrl,
    likes: cardObject.likes
  });

  cards.save()
    .then(() => res.status(201).json({ message: 'card enregistré et publié !' }))
    .catch(error => {
      res.status(400).json({ error })
    })

};

exports.showcard = (req, res, next) => {
  // inverser ordre d'apparition >> du plus récent au plus ancien
  card.find()
    .then(card => res.status(200).json(card.sort((a, b) => b.createdDate - a.createdDate)))
    .catch(error => res.status(400).json({ error }));
};

exports.afficherCardById = (req, res, next) => {
  card.findOne({ _id: req.params.id })
    .then(card => res.status(200).json(card))
    .catch(error => res.status(400).json({ error }));
};

exports.modifycard = (req, res, next) => {
  try {
    let cardObject = {}
    card.findOne({ _id: req.params.id })
      .then((card) => {
        if (req.auth.userId != card.userId && req.auth.role != "admin") {
          res.status(401).json({ message: `Vous n'avez pas l'autorisation de modifier ce post` })
        }
        else {
          if (req.file) {
            card.findOne({
              _id: req.params.id
            }).then((card) => {
              const filename = card.imageUrl.split('/images/')[1]
              fs.unlinkSync(`images/${filename}`)
            }),
              cardObject = {
                ...JSON.parse(req.body),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
              }

          }
          else {
            cardObject = { ...req.body }
          }

          card.updateOne(
            { _id: req.params.id }, { ...cardObject }
          )
            .then(() => res.status(200).json({ message: 'card modifié !' }))
            .catch(() => {
              throw new Error(`Erreur lors de l'enregistrement de la modification`)
            })
        }
      })
  }

  catch (error) {
    res.status(500).json({ error })
  }
};

exports.deletecard = (req, res, next) => {
  card.findOne({ _id: req.params.id })
    .then((card) => {
      if (req.auth.userId != card.userId && req.auth.role != "admin") {
        res.status(401).json({ message: `Vous n'avez pas l'autorisation de supprimer ce post` })
      } else {
        if (card.imageUrl != null) {
          let filename = card.imageUrl.split('/images/')[1];
          fs.unlink(`images/${filename}`, () => {
            card.deleteOne({ _id: req.params.id })
              .then(() => res.status(200).json({ message: 'post et image supprimés' }))
              .catch(error => res.status(400).json({ error }));
          })
        }
        else {
          card.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'post supprimé' }))
            .catch(error => res.status(400).json({ error }));
        }
      }
    })

    .catch(error => res.status(500).json({ error }));
};

exports.likecard = (req, res, next) => {

  let like = req.body.like;
  let cardId = req.params.id;
  let userId = req.body.userId;

  // si c'est un like
  if (like === true) {
    card.findOne({ _id: cardId })
      .then((card) => {
        if (card.usersLiked.includes(userId)) {
          res.status(201).json({ message: "post déjà liké" });
        }
        else {
          card.updateOne({ $push: { usersLiked: userId }, $inc: { likes: +1 } })
            .then(() => {
              res.status(200).json({ message: 'like ajouté' })
            }
            )
            .catch(error => {
              throw new Error(`Erreur lors de l'ajout du Like`)
            })
        }
      })
      .catch(error => {
        throw new Error(`Carte non trouvée`)
      })
  }
  //Suppression d'un like
  if (like === false) {
    card.findOne({ _id: cardId })
      .then((card) => {
        if (!card.usersLiked.includes(userId) === false) {
          res.status(201).json({ message: "post déjà disliké" });
        }
        else {
          card.updateOne({ $pull: { usersLiked: userId }, $inc: { likes: -1 }, })
            .then(() => res.status(200).json({ message: 'like supprimé' }))
            .catch(error => {
              throw new Error(`Erreur lors de la suppresion du Like`)
            })
        }
      })
      .catch(error => res.status(500).json({ error }))
  }
}
