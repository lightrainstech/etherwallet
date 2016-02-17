// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'chart.js','ngStorage'])

.run(function($ionicPlatform, $rootScope, $ionicLoading) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.apiBase = "https://etherchain.org/api";

  $rootScope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $rootScope.hide = function(){
    $ionicLoading.hide();
  };


})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.checkbalance', {
    url: '/checkbalance',
    views: {
      'menuContent': {
        templateUrl: 'templates/checkbalance.html',
        controller: 'ChkBalanceCtrl'
      }
    }
  })

  .state('app.price', {
    url: '/price',
    views: {
      'menuContent': {
        templateUrl: 'templates/price.html',
        controller: 'PriceCtrl'
      }
    }
  })
  .state('app.marketcap', {
    url: '/marketcap',
    views: {
      'menuContent': {
        templateUrl: 'templates/marketcap.html',
        controller: 'MarketCtrl'
      }
    }
  })

  .state('app.credits', {
    url: '/credits',
    views: {
      'menuContent': {
        templateUrl: 'templates/credits.html',
        controller: 'CreditCtrl'
      }
    }
  })

  .state('app.transactions', {
    url: '/transactions',
    views: {
      'menuContent': {
        templateUrl: 'templates/transactions.html',
        controller: 'TransactionsCtrl'
      }
    }
  })

  .state('app.send', {
    url: '/send',
    views: {
      'menuContent': {
        templateUrl: 'templates/send.html',
        controller: 'sendCtrl'
      }
    }
  })

  .state('app.block', {
    url: '/block/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/block.html',
        controller: 'SingleBlockCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/checkbalance');
});
