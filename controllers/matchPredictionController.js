const MatchPrediction = require('../models/MatchPrediction');
const User = require('../models/User');
const Match = require('../models/Match');

const { calculatePoints, determineWinner } = require('./utils')

const getMatchPredictions = async (req, res) => {
  const matchPredictions = await MatchPrediction.find();
  res.json(matchPredictions);
};

const getMatchPrediction = async (req, res) => {
  const { id } = req.params;
  const matchPrediction = await MatchPrediction.findById(id);
  if (!matchPrediction) {
    return res.status(404).json({ error: 'MatchPrediction not found' });
  }
  res.json(matchPrediction);
};

const createMatchPrediction = async (req, res) => {
  const { match, user, goalsHome, goalsAway } = req.body;
  const existingUser = await User
    .findById(user)
    .populate('matchPredictions');
  
    if (!existingUser) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }
    if (existingUser.matchPredictions.find(mp => mp.match.toString() === match)) {
      return res.status(400).json({ error: 'Match prediction already exists' });
    }
    const existingMatch = await Match
      .findById(match)

    if (!existingMatch) {
      return res.status(404).json({ error: 'Match not found' });
    }

  const winner = determineWinner(goalsHome, goalsAway);
  const matchPrediction = new MatchPrediction({ goalsHome, goalsAway, winner, match, user });
  await matchPrediction.save();
  
  // Add matchPrediction to user and match
  existingUser.matchPredictions = existingUser.matchPredictions.concat(matchPrediction);
  await existingUser.save();
  existingMatch.matchPredictions = existingMatch.matchPredictions.concat(matchPrediction);
  await existingMatch.save();

  res.status(201).json(matchPrediction);
};

const updateMatchPrediction = async (req, res) => {
  const { id } = req.params;
  const matchPrediction = await MatchPrediction.findByIdAndUpdate(id, req.body, { new: true });
  if (!matchPrediction) {
    return res.status(404).json({ error: 'MatchPrediction not found' });
  }
  res.json(matchPrediction);
};

const deleteMatchPrediction = async (req, res) => {
  const { id } = req.params;
  await MatchPrediction.findByIdAndDelete(id);
  res.status(204).end();
};

module.exports = {
  getMatchPredictions,
  getMatchPrediction,
  createMatchPrediction,
  updateMatchPrediction,
  deleteMatchPrediction
}