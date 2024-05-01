const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MatchSchema = new Schema({
  teamHome: {
    type: String,
    required: true
  },
  teamAway: {
    type: String,
    required: true
  },
  startTime: {
    type: Date
  },
  matchPredictions: {
    type: [Schema.Types.ObjectId],
    ref: 'MatchPrediction'
  },
  result: {
    goalsHome: {
      type: Number
    },
    goalsAway: {
      type: Number
    },
    winner: {
      type: String
    },
    default: {}
  }
}, { timestamps: true });

MatchSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
});

const Match = mongoose.model('Match', MatchSchema);

module.exports = Match;