// Ionic Starter App
//set global and provider
web3 = new Web3();
if (typeof localStorage.NodeHost == 'undefined') {
  localStorage.NodeHost = "http://eth.lightrains.com";
}
angular.module('starter', ['ionic', 'starter.controllers','starter.services','chart.js','ngStorage'])

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

.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $ionicConfigProvider.tabs.position('bottom');
  $stateProvider
  $stateProvider
  .state('tabs', {
    url: "/tab",
    abstract: true,
    templateUrl: "templates/tabs.html"
  })
  // .state('tabs.checkbalance', {
  //   url: "/checkbalance",
  //   views: {
  //     'home-tab': {
  //       templateUrl: "templates/checkbalance.html",
  //       controller: 'ChkBalanceCtrl'
  //     }
  //   }
  // })
  .state('tabs.wallet', {
    url: "/wallet",
    views: {
      'home-tab': {
        templateUrl: "templates/wallet.html",
        controller: 'WalletCtrl'
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
  $urlRouterProvider.otherwise('/tab/wallet');
});
