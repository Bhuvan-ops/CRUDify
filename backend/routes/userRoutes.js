const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();
const authenticate = require("../middlewares/authMiddleware");

router.post('/', authenticate, userController.createUser);

router.get('/', userController.getUsers);

router.get('/:id', userController.getUserById);

router.put('/:id', authenticate, userController.updateUser);

router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
