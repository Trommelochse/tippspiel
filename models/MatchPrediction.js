const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const matchPredictionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  match: {
    type: Schema.Types.ObjectId,
    required: true
  },
  goalsHome: {
    type: Number,
    required: true
  },
  goalsAway: {
    type: Number,
    required: true
  },
  winner: {
    type: String,
    required: true
  },
  hasBeenScored: {
    type: Boolean,
    default: false
  },
  points: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const MatchPrediction = mongoose.model('MatchPrediction', matchPredictionSchema);

module.exports = MatchPrediction;