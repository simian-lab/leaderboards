var express = require('express');
var mongoClient = require('mongodb').MongoClient;
var request = require('request');

var app = express();

// MongoDB Node.js Driver Documentation: http://mongodb.github.io/node-mongodb-native/2.2/
var mongoUrl = 'mongodb://localhost:27017/leaderboards';

app.use(express.static('dev'));

app.get('/get-token/:code', function(req, res) {
  var postOptions, userCode;

  userCode = req.params.code;

  postOptions = {
    url: 'https://wakatime.com/oauth/token',
    form: {
      'client_id': 'YOUR_CLIENT_ID',
      'client_secret': 'YOUR_CLIENT_SECRET',
      'redirect_uri': 'http://localhost:5000/',
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
    });
  });
});

app.listen(5000, function () {
  console.log('Listening on port 5000');
});
