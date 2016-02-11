angular.module('starter.controllers', ['chart.js', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // Form data for the login modal
  $scope.loginData = {};

})

.controller('StatiticsCtrl', function($scope, $http, $rootScope, $ionicLoading) {
  $rootScope.show($ionicLoading);

  $http.get($rootScope.apiBase + '/basic_stats').then(function(resp) {
    $rootScope.hide($ionicLoading);
    $scope.playlists = resp.data.data.blocks;
  });

  $scope.doRefresh = function() {
    $http.get($rootScope.apiBase + '/basic_stats').then(function(resp) {
      items = resp.data.data.blocks;
      $scope.playlists = items.concat($scope.playlists);
      $scope.$broadcast('scroll.refreshComplete');
    });
  };
})

.controller('SingleBlockCtrl', function($scope, $http, $rootScope, $ionicLoading) {

})


.controller('ChkBalanceCtrl', function($scope, $stateParams, $http, $rootScope, $q, $ionicLoading, $localStorage) {

  $scope.data = {ethaddr : $localStorage.addSave,ifSave : ($localStorage.addSave) ? true : false};

  $scope.checkBalance = function(data){
    $rootScope.show($ionicLoading);

    if(data.ifSave == true){
      $localStorage.addSave = data.ethaddr;
    } else {
      $localStorage.addSave = "";
      data.ethaddr = "";
    }

    $http.get($rootScope.apiBase + '/account/' + data.ethaddr).then(function(resp) {
      $rootScope.hide($ionicLoading);
      data.ethaddr = '';
      if ( typeof(resp.data.data[0]) !== 'undefined') {
        $scope.response = (resp.data.data[0].balance * 0.000000000000000001) + ' ETH';
        $scope.error = '';
      } else {
        $scope.error = "Sorry, Not a valid Ether Account";
      }
    }, function(err) {
      data.ethaddr = '';
      $rootScope.hide($ionicLoading);
      $scope.error = "Some error occured, please try again.";
    })
  }
})

.controller('PriceCtrl', function($scope, $http,$filter, $rootScope, $ionicLoading) {

  $rootScope.show($ionicLoading);


  $http.get($rootScope.apiBase + '/statistics/price').then(function(resp) {
    $rootScope.hide($ionicLoading);

    var lastThirty = resp.data.data.reverse().slice(0, 50);
    var lastTen = lastThirty.slice(0, 8);
    lastTen = lastTen.reverse();
    var labels = [], usds = [];

    angular.forEach(lastTen, function(num) {
      labels.push($filter('date')(num.time, "HH:mm"));
      usds.push(num.usd.toString());
    });

    $scope.labels = labels;
    $scope.data = [usds];

    // $scope.onClick = function (points, evt) {
    //   var clicked = points[0].value;
    //   var change = lastThirty[0].usd - clicked;
    //   $scope.lastusd = (change >= 0) ? '$ ' + clicked + ' <span class="ion-android-arrow-dropup up"></span>' : '$ ' + clicked + ' <span class="ion-android-arrow-dropdown down"></span>';
    //   setTimeout(function(){
    //     var nchange = lastThirty[0].usd - lastThirty[1].usd;
    //     console.log(nchange);
    //     $scope.lastusd = (nchange >= 0) ? '$ ' + lastThirty[0].usd+ ' <span class="ion-android-arrow-dropup up"></span>' : '$ ' + lastThirty[0].usd + ' <span class="ion-android-arrow-dropdown down"></span>';
    //   },2000);
    // };


    $scope.items = lastThirty;
    var change = lastThirty[0].usd - lastThirty[1].usd;
    $scope.lastusd = (change >= 0) ? '$ ' + lastThirty[0].usd+ ' <span class="ion-android-arrow-dropup up"></span>' : '$ ' + lastThirty[0].usd + ' <span class="ion-android-arrow-dropdown down"></span>';
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })

})


.controller('CreditCtrl', function($scope, $http, $rootScope, $cordovaClipboard) {
  $scope.copyThis = function () {
    $cordovaClipboard
    .copy('0xc2593b43eef66488d45b014fc8f86830f08c48fd')
    .then(function () {
      alert("copied");
      $scope.copied = "Address Copied Successfully...";
    }, function () {alert("Not copied");
      $scope.copied = "Not able to copy...";
    });
  }
})

.controller('MarketCtrl', function($scope, $http, $localStorage, $rootScope, $ionicLoading) {
  var socket = io.connect('http://socket.coincap.io');
  $scope.values = [];
  $rootScope.show($ionicLoading);

  $scope.doRefresh = function() {
    $rootScope.show($ionicLoading);
    $http.get('http://www.coincap.io/history/1day/ETH').then(function(resp) {
      $rootScope.hide($ionicLoading);
      $scope.$broadcast('scroll.refreshComplete');
      $scope.values.mktcap = resp.data.market_cap[0][1];
      $scope.values.price = resp.data.price[0][1];
      $scope.values.volume = resp.data.volume[0][1];
    });
  };

  $http.get('http://www.coincap.io/history/1day/ETH').then(function(resp) {
    $rootScope.hide($ionicLoading);
    $scope.values.mktcap = resp.data.market_cap[0][1];
    $scope.values.price = resp.data.price[0][1];
    $scope.values.volume = resp.data.volume[0][1];
  });
  socket.on('trade', function (tradeMsg) {
    $localStorage.marketcap = tradeMsg;
    console.log(tradeMsg);
    if(tradeMsg.message.coin === "ETH") {
      $scope.values.short = tradeMsg.message.msg.short;
      $scope.values.long = tradeMsg.message.msg.long;
      $scope.values.time = tradeMsg.message.msg.time;
      $scope.values.cap24hrChange = tradeMsg.message.msg.cap24hrChange;
      $scope.values.price = tradeMsg.message.msg.price;
      $scope.values.mktcap = tradeMsg.message.msg.mktcap;
      $scope.values.supply = tradeMsg.message.msg.supply;
      $scope.values.volume = tradeMsg.message.msg.volume;
    }
  })
  // socket.on('global', function (globalMsg) {
  //   console.log(globalMsg);
  // })

});
