const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const verifyPassword = require('../middleware/password');
const auth = require('../middleware/auth');


router.post('/signup', verifyPassword, userController.signup);
router.post('/login', userController.login);
router.delete('/', auth, userController.deleteUser);
router.get('/user', userController.User);

module.exports = router;