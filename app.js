var dotEnv      = require('dotenv').config(),
    express     = require('express'),
    mongoClient = require('mongodb').MongoClient,
    request     = require('request'),
    queryString = require('querystring'),
    app         = express();

/* For your local environment start first MongoDB with:
  mongod --dbpath /path/to/your/database */

// MongoDB Node.js Driver Documentation: http://mongodb.github.io/node-mongodb-native/2.2/
var mongoUrl = process.env.MONGODB_URI;

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.static('prod'));

app.get('/get-token/:code', function(req, res) {
  var postOptions, userCode;

  userCode = req.params.code;

  postOptions = {
    url: 'https://wakatime.com/oauth/token',
    form: {
      'client_id': process.env.WAKATIME_APP_ID,
      'client_secret': process.env.WAKATIME_APP_SECRET,
      'redirect_uri': process.env.REDIRECT_URI,
      'grant_type': 'authorization_code',
      'code': userCode
    }
  }

  function callback(error, response, body) {
    res.send(body);
  }

  // Simplified HTTP request client: https://www.npmjs.com/package/request
  request.post(postOptions, callback);
});

app.get('/save-token/:username/:accessToken', function(req, res) {
  var accessToken, username;

  username = req.params.username;
  accessToken = req.params.accessToken;

  mongoClient.connect(mongoUrl, function(err, db) {
    var usersCollection;

    usersCollection = db.collection('users');

    usersCollection.find({ username: username }).toArray(function(error, response) {
      if (response.length === 0) {
        usersCollection.insertOne({
          username: username,
          access_token: accessToken
        }, function(error, response) {

          if (error) {
            res.send(error);
          }
          else {
            res.send(response);
          }

          db.close();
        });
      }
      else {
        usersCollection.updateOne({ username: username }, {$set: {
          access_token: accessToken
        }}, function(error, response) {

          if (error) {
            res.send(error);
          }
          else {
            res.send(response);
          }

          db.close();
        });
      }
    });
  });
});

app.get('/get-users/', function(req, res) {
  mongoClient.connect(mongoUrl, function(error, db) {
    db.collection('users').find().toArray(function(error, response) {
      res.send(response);
      db.close();
    });
  });
});

app.listen(process.env.PORT || 5000, function () {
  console.log('Listening on port 5000');
});
