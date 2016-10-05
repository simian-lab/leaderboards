'use strict'

angular.module('leaderboards.users', [])

.factory('UsersService', [
  '$http', '$q', 'REDIRECT_URI',
  function($http, $q, REDIRECT_URI) {
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

        $http.get(REDIRECT_URI + 'get-users').then(function(response) {
          deferred.resolve(response.data);
        });

        return deferred.promise;
      }
    }
}])
;
