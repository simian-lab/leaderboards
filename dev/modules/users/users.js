'use strict'

angular.module('leaderboards.users', [])

.factory('UsersService', [
  '$http', '$q',
  function($http, $q) {
    return {
      getUsers: function() {
        var deferred;

        deferred = $q.defer();

        $http.get('json/users.json').success(function(response) {
          deferred.resolve(response);
        });

        return deferred.promise;
      },
      getTokens: function() {
        var deferred;

        deferred = $q.defer();

        $http.get('/get-users').then(function(response) {
          deferred.resolve(response.data);
        });

        return deferred.promise;
      }
    }
}])
;
