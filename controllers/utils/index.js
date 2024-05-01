const calculatePoints = (prediction, result) => {
  if (result.goalsHome === prediction.goalsHome && result.goalsAway === prediction.goalsAway) {
    return 3;
  }
  if (result.winner === prediction.winner && (result.goalsHome - result.goalsAway) === (prediction.goalsHome - prediction.goalsAway)) {
    return 2;
  }
  if (result.winner === prediction.winner) {
    return 1;
  }
  return 0;
}

  const determineWinner = (goalsHome, goalsAway) => {
    return goalsHome > goalsAway ? 'home' : goalsHome < goalsAway ? 'away' : 'draw';
  };

module.exports = {
  calculatePoints,
  determineWinner
};