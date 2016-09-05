'use strict';

angular.module('leaderboards.home', [])

.controller('HomeController', [
  '$location', '$scope', '$state', 'AuthService', 'UsersService', 'WakatimeService', 'CLIENT_ID', 'REDIRECT_URI',
  function($location, $scope, $state, AuthService, UsersService, WakatimeService, CLIENT_ID, REDIRECT_URI) {
    var userCode;

    $scope.addingUser = false;

    $scope.authorizeUrl = 'https://wakatime.com/oauth/authorize?client_id=' +
    CLIENT_ID +
    '&response_type=code&scope=read_logged_time&redirect_uri=' +
    REDIRECT_URI;

    if ($location.search().code !== undefined) {

      $scope.addingUser = true;

      userCode = $location.search().code;

      AuthService.getToken(userCode).then(function(response) {
        var accessToken;

        accessToken = response.access_token;

        WakatimeService.getUserInfo(accessToken).then(function(response) {
          var currentUserUsername, wakatimeResponse;

          wakatimeResponse = response;
          currentUserUsername = wakatimeResponse.data.username;

          UsersService.getUsers().then(function(response) {
            var simianUsers, userApproved;

            simianUsers = response.users;
            userApproved = false;

            angular.forEach(simianUsers, function(user) {
              if (user.username === currentUserUsername) {
                userApproved = true;
              }
            });

            if (userApproved) {
              AuthService.saveToken(currentUserUsername, accessToken).then(function(response) {
                $state.reload();
              });
            }
          });
        });
      });
    }

    UsersService.getTokens().then(function(response) {
      var tokens;

      tokens = response;

      UsersService.getUsers().then(function(response) {
        var users, usersAdded;

        users = response.users;
        usersAdded = 0;

        angular.forEach(tokens, function(token) {
          WakatimeService.getUserInfo(token.access_token).then(function(response) {
            var editors, languages;

            for (var i = 0; i < users.length; i++) {
              if(users[i].username == response.data.username) {
                users[i].wakatime_data = response.data;

                editors = '';
                languages = '';

                for (var j = 0; j < response.data.languages.length; j++) {
                  if (j === response.data.languages.length - 1) {
                    languages = languages + response.data.languages[j].name;
                  }
                  else {
                    languages = languages + response.data.languages[j].name + ', ';
                  }
                }

                users[i].languages = languages;

                for (var j = 0; j < response.data.editors.length; j++) {
                  if (j === response.data.editors.length - 1) {
                    editors = editors + response.data.editors[j].name;
                  }
                  else {
                    editors = editors + response.data.editors[j].name + ', ';
                  }
                }

                users[i].editors = editors;

                usersAdded = usersAdded + 1;

                if (usersAdded === users.length) {
                  users.sort(function(a, b) {
                    if (a.wakatime_data.total_seconds > b.wakatime_data.total_seconds) {
                      return -1;
                    }

                    if (a.wakatime_data.total_seconds < b.wakatime_data.total_seconds) {
                      return 1;
                    }

                    return 0;
                  });
                }
              }
            }
          });
        });

        $scope.users = users;
      });
    });
  }
])
;
