const express = require('express');
const {
  getMatchPredictions,
  getMatchPrediction,
  createMatchPrediction,
  updateMatchPrediction,
  deleteMatchPrediction
} = require('../controllers/predictionController');

const router = express.Router();

router.get('/', getMatchPredictions);
router.get('/:id', getMatchPrediction);
router.post('/', createMatchPrediction);
router.put('/:id', updateMatchPrediction);
router.delete('/:id', deleteMatchPrediction);

module.exports = router;