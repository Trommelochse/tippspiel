require('dotenv').config();
const MONGODB_URI = process.env.MONGODB_URI;
const mongoose = require('mongoose');
const User = require('./models/User');
const Match = require('./models/Match');
const MatchPrediction = require('./models/MatchPrediction');

const data = {
  "matches": [
    {
      "teamHome": "Germany",
      "teamAway": "Scotland",
      "startTime": "2024-06-14T19:00:00.000+00:00"
    },
    {
      "teamHome": "Hungary",
      "teamAway": "Switzerland",
      "startTime": "2024-06-15T13:00:00.000+00:00"
    },
    {
      "teamHome": "Spain",
      "teamAway": "Croatia",
      "startTime": "2024-06-15T16:00:00.000+00:00"
    },
    {
      "teamHome": "Italy",
      "teamAway": "Albania",
      "startTime": "2024-06-15T19:00:00.000+00:00"
    },
    {
      "teamHome": "Poland",
      "teamAway": "Netherlands",
      "startTime": "2024-06-16T13:00:00.000+00:00"
    },
    {
      "teamHome": "Slovenia",
      "teamAway": "Denmark",
      "startTime": "2024-06-16T16:00:00.000+00:00"
    },
    {
      "teamHome": "Serbia",
      "teamAway": "England",
      "startTime": "2024-06-16T19:00:00.000+00:00"
    }
  ],
  "users": [
    {
      name: 'Clemens',
      email: 'clemens.a.janes@gmail.com',
    },
    {
      name: 'Babybears',
      email: 'babybears.tallinn@gmail.com'
    }
  ]
};

const seed = async ({ predict = true }) => {

  const determineWinner = (goalsHome, goalsAway) => {
    return goalsHome > goalsAway ? 'home' : goalsHome < goalsAway ? 'away' : 'draw';
  };

  try {
    await mongoose.connect(MONGODB_URI);

    await User.deleteMany();
    const users = [];
    for (let user of data.users) {
      const newUser = new User(user);
      await newUser.save();
      users.push(newUser);
    }

    console.log(`Seeded ${users.length} users`);

    await Match.deleteMany();
    const matches = await Match.insertMany(data.matches);
    console.log(`Seeded ${matches.length} matches`);
    
    await MatchPrediction.deleteMany();

    
    if (!predict) {
      console.log('Data import successful');
      await mongoose.connection.close();
      return;
    }
    
    const randomBetween = (min, max) => {
      return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const matchPredictions = [];
    for (let i = 0; i < users.length; i++) {
      for (let j = 0; j < matches.length; j++) {
        const goalsHome = randomBetween(0, 4);
        const goalsAway = randomBetween(0, 3);
        const winner = determineWinner(goalsHome, goalsAway);
        const matchPrediction = new MatchPrediction({
          user: users[i]._id,
          match: matches[j]._id,
          goalsHome,
          goalsAway,
          winner
        });
        const matchPredictionDocument = await matchPrediction.save();
        matchPredictions.push(matchPredictionDocument);
        matches[j].matchPredictions.push(matchPredictionDocument._id);
        await matches[j].save();
        users[i].matchPredictions.push(matchPredictionDocument._id);
        await users[i].save();
      }
    }

    console.log(`Seeded ${matchPredictions.length} match predictions`);
    console.log('Data import successful');

    await mongoose.connection.close();
  } catch (err) {
    console.error('Error importing data: ' + err);
  } finally {
    process.exit();
  } 
};


seed({ predict: false});