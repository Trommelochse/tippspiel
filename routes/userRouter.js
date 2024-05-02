const express = require('express');
const {
    getUsers,
    getUser,
    createUser,
    updateUser,
    deleteUser,
    login, 
    recalculatePoints} = require('../controllers/authController');

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);
router.put('/:id', updateUser);
router.put('/:id/recalculatePoints', recalculatePoints);
router.delete('/:id', deleteUser);

router.post('/login', login);

module.exports = router;
