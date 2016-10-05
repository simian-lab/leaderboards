'use strict';

angular.module('leaderboards.wakatime', [])

.factory('WakatimeService', [
  '$http', '$q', 'REDIRECT_URI',
  function($http, $q, REDIRECT_URI) {
    return {
      getUserInfo: function(accessToken) {
        var deferred, requestConfig;

        deferred = $q.defer();

        requestConfig = {
          method: 'GET',
          url: REDIRECT_URI + 'last_7_days_stats?access_token=' + accessToken,
        }

        $http(requestConfig).then(function(response) {
          deferred.resolve(response.data);
        },
        function(error) {
          deferred.reject('request to WakaTime couldn\'t be completed.');
        });

        return deferred.promise;
      }
    }
  }
])
;
