'use strict';

angular.module('leaderboards.home', [])

.controller('HomeController', [
  '$location', '$scope', '$state', 'AuthService', 'UsersService', 'WakatimeService',
  function($location, $scope, $state, AuthService, UsersService, WakatimeService) {
    var userCode;

    $scope.addingUser = false;

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
        $scope.users = response.users;

        angular.forEach(tokens, function(token) {
          WakatimeService.getUserInfo(token.access_token).then(function(response) {
            for (var i = 0; i < $scope.users.length; i++) {
              if($scope.users[i].username == response.data.username) {
                $scope.users[i].wakatime_data = response.data;
              }
            }
          });
        });
      });
    });
  }
])
;