'use strict';

angular.module('leaderboards.wakatime', [])

.factory('WakatimeService', [
  '$http', '$q',
  function($http, $q) {
    return {
      getUserInfo: function(accessToken) {
        var deferred, requestConfig;

        deferred = $q.defer();

        requestConfig = {
          method: 'GET',
          url: 'http://crossorigin.me/https://wakatime.com/api/v1/users/current/stats/last_7_days?access_token=' + accessToken,
        }

        $http(requestConfig).then(function(response) {
          deferred.resolve(response.data);
        });

        return deferred.promise;
      }
    }
  }
])
;
