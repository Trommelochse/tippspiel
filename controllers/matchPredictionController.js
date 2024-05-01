const MatchPrediction = require('./models/MatchPrediction');

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
  const winner = determineWinner(goalsHome, goalsAway);
  const matchPrediction = new MatchPrediction({ goalsHome, goalsAway, winner, match, user });
  await matchPrediction.save();
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

const scoreMatchPrediction = async (req, res) => {
  const { id } = req.params;
  const matchPrediction = await MatchPrediction
    .findById(id)
    .populate('user')
    .populate('match');
  if (!matchPrediction) {
    return res.status(404).json({ error: 'MatchPrediction not found' });
  }
  
  const user = matchPrediction.user;
  const match = matchPrediction.match;
  const points = calculatePoints(matchPrediction, match);
  matchPrediction.points = points;
  user.points += points;
  matchPrediction.hasBeenScored = true;

  const updatedMatchPrediction = await matchPrediction.save();
  await user.save();
  res.json(updatedMatchPrediction);
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
  scoreMatchPrediction,
  deleteMatchPrediction
}