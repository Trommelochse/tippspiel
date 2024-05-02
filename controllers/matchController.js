const Match = require('../models/Match');
const MatchPrediction = require('../models/MatchPrediction');
const User = require('../models/User');
const { calculatePoints, determineWinner } = require('./utils');

const getMatches = async (req, res) => {
  const matches = await Match.find();
  res.json(matches);
};

const getMatch = async (req, res) => {
  const { id } = req.params;
  const match = await Match.findById(id);
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  res.json(match);
};

const createMatch = async (req, res) => {
  const match = new Match(req.body);
  try {
    await match.save();
    return res.status(201).json(match);
  }
  catch (err) {
    return res.status(400).json(err);
  }
};

const scoreMatch = async (req, res) => {
  const { id } = req.params;
  const match = await Match.findById(id);
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }


  const { goalsHome, goalsAway } = req.body;
  const result = { goalsHome, goalsAway };
  result.winner = determineWinner(goalsHome, goalsAway);
  match.result = result;
  await match.save();

  const matchPredictions = await MatchPrediction.find({ match });
  for (const prediction of matchPredictions) {
    const user = await User.findById(prediction.user);
    const points = calculatePoints(prediction, match.result);
    console.log('Points:', points);
    prediction.points = points;
    user.points += points;
    prediction.hasBeenScored = true;
    await prediction.save();
    await user.save();
  }

  res.sendStatus(200);
};

const deleteMatch = async (req, res) => {
  const { id } = req.params;
  const match = await Match.findByIdAndDelete(id);
  if (!match) {
    return res.status(404).json({ error: 'Match not found' });
  }
  res.status(204).end();
};

module.exports = {
  getMatches,
  getMatch,
  createMatch,
  scoreMatch,
  deleteMatch
};