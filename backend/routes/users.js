const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth, userController.getAllUsers);
router.get('/me', auth, userController.getCurrentUser);
router.get('/:id', auth, userController.getUserById);
router.put('/:id/role', auth, userController.updateUserRole);

module.exports = router;
