const express = require('express');
const {
  getMatches,
  getMatch,
  createMatch,
  scoreMatch,
  deleteMatch
} = require('../controllers/matchController');

const router = express.Router();

router.get('/', getMatches);
router.get('/:id', getMatch);
router.post('/', createMatch);
router.put('/:id/score', scoreMatch);
router.delete('/:id', deleteMatch);

module.exports = router;