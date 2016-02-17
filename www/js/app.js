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
  $stateProvider
     .state('tabs', {
       url: "/tab",
       abstract: true,
       templateUrl: "templates/tabs.html"
     })
     .state('tabs.checkbalance', {
       url: "/checkbalance",
       views: {
         'home-tab': {
           templateUrl: "templates/checkbalance.html",
           controller: 'ChkBalanceCtrl'
         }
       }
     })
     .state('tabs.price', {
       url: "/price",
       views: {
         'price-tab': {
           templateUrl: "templates/price.html",
           controller: 'PriceCtrl'
         }
       }
     })
     .state('tabs.marketcap', {
       url: "/marketcap",
       views: {
         'marketcap-tab': {
           templateUrl: "templates/marketcap.html",
           controller: 'MarketCtrl'
         }
       }
     })
     .state('tabs.credits', {
       url: "/credits",
       views: {
         'credits-tab': {
           templateUrl: 'templates/credits.html',
           controller: 'CreditCtrl'
         }
       }
     })
     .state('tabs.send', {
       url: "/send",
       views: {
         'send-tab': {
           templateUrl: 'templates/send.html',
           controller: 'sendCtrl'
         }
       }
     });


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/checkbalance');
});
