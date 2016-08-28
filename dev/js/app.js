angular.module('leaderboards', [

  'ui.router',

  'leaderboards.auth',
  'leaderboards.home',
  'leaderboards.users',
  'leaderboards.wakatime'
])

.config([
  '$locationProvider', '$stateProvider',
  function($locationProvider, $stateProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $stateProvider.state('home', {
      url: '/:params',
      controller: 'HomeController',
      templateUrl: '/modules/home/home.tpl.html'
    })
}])

.controller('AppController', [
  '$scope',
  function($scope) {
    console.log('AppController');
  }
])
;
