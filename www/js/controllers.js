angular.module('starter.controllers', [])

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


.controller('ChkBalanceCtrl', function($scope, $stateParams, $http, $rootScope, $q, $ionicLoading) {

  $scope.checkBalance = function(data){
    $rootScope.show($ionicLoading);

    // if ( typeof(data.ifSave) !== 'undefined') {
    //   window.localStorage['ethaddr'] = data.ethaddr;
    // }

    $http.get($rootScope.apiBase + '/account/' + data.ethaddr).then(function(resp) {
      $rootScope.hide($ionicLoading);
      data.ethaddr = '';
      if ( typeof(resp.data.data[0]) !== 'undefined') {
        $scope.response = resp.data.data[0].balance + ' ETH';
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

.controller('PriceCtrl', function($scope, $http, $rootScope, $ionicLoading) {

  $rootScope.show($ionicLoading);

  $http.get($rootScope.apiBase + '/statistics/price').then(function(resp) {
    $rootScope.hide($ionicLoading);
    var lastThirty = resp.data.data.reverse().slice(0, 50);

    $scope.items = lastThirty;

    // For JSON responses, resp.data contains the result
  }, function(err) {
    console.error('ERR', err);
    // err.status will contain the status code
  })

})


.controller('CreditCtrl', function($scope, $http, $rootScope) {
  // $scope.copyThis = function () {
  //   $cordovaClipboard
  //   .copy('0xc2593b43eef66488d45b014fc8f86830f08c48fd')
  //   .then(function () {
  //     $scope.copied = "Address Copied Successfully...";
  //   }, function () {
  //     $scope.copied = "Not able to copy...";
  //   });
  // }
});
