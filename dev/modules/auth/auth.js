'use strict';

angular.module('leaderboards.auth', [])

.factory('AuthService', [
  '$http', '$q',
  function($http, $q) {
    return {
      getToken: function(userCode) {
        var deferred;

        deferred = $q.defer();

        $http.get('/get-token/' + userCode).then(function(response) {
          deferred.resolve(response.data);
        });

        return deferred.promise;
      },
      saveToken: function(username, accessToken) {
        var deferred;

        deferred = $q.defer();

        $http.get('/save-token/' + username + '/' + accessToken).then(function(response) {
          deferred.resolve(response);
        });

        return deferred.promise;
      }
    }
  }
])
;
