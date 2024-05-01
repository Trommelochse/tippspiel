const express = require('express');
const { getUsers, createUser, getUser, updateUser, deleteUser, login } = require('../controllers/authController');
const router = express.Router();

// Create a user
router.post('/', createUser);

// Get a user
router.get('/:id', getUser);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

router.get('/', getUsers)

// Login route
router.post('/login', login);



module.exports = router;
