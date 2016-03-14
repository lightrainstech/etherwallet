angular.module('starter.controllers', ['chart.js', 'ngCordova'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

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

    if(data.ifSave == true){
      $localStorage.addSave = data.ethaddr;
    } else {
      $localStorage.addSave = "";
      data.ethaddr = "";
    }
    var address = data.ethaddr;
    var isAddress = /^(0x)?[0-9a-f]{40}$/i.test(address);
    if(isAddress === true) {
      $rootScope.show($ionicLoading);
      $http.get($rootScope.apiBase + '/account/' + data.ethaddr).then(function(resp) {
        $rootScope.hide($ionicLoading);
        if ( typeof(resp.data.data[0]) !== 'undefined') {
          $scope.response = (resp.data.data[0].balance * 0.000000000000000001) + ' ETH';
          $scope.error = '';
        } else {
          $scope.error = "Sorry, No transactions found.";
        }
      }, function(err) {
        $rootScope.hide($ionicLoading);
        $scope.error = "Some error occured, please try again.";
      })
    } else {
      $scope.error = "Sorry, Not a valid Ether Account";
    }

  }
})

.controller('PriceCtrl', function($scope, $http,$filter, $rootScope, $ionicLoading) {

  $rootScope.show($ionicLoading);

  $scope.doRefresh = function() {
    $http.get($rootScope.apiBase + '/statistics/price').then(function(resp) {
      $scope.$broadcast('scroll.refreshComplete');
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
      $scope.items = lastThirty;
      var change = lastThirty[0].usd - lastThirty[1].usd;
      $scope.lastusd = (change >= 0) ? '$ ' + lastThirty[0].usd+ ' <span class="ion-android-arrow-dropup up"></span>' : '$ ' + lastThirty[0].usd + ' <span class="ion-android-arrow-dropdown down"></span>';
    });
  };

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
    $scope.items = lastThirty;
    var change = lastThirty[0].usd - lastThirty[1].usd;
    $scope.lastusd = (change >= 0) ? '$ ' + lastThirty[0].usd+ ' <span class="ion-android-arrow-dropup up"></span>' : '$ ' + lastThirty[0].usd + ' <span class="ion-android-arrow-dropdown down"></span>';
  }, function(err) {
    console.error('ERR', err);
  })

})


.controller('CreditCtrl', function($scope, $http, $rootScope) {
  // .controller('CreditCtrl', function($scope, $http, $rootScope, $cordovaClipboard) {
  // $scope.copyThis = function () {
  //   $cordovaClipboard
  //   .copy('0xc2593b43eef66488d45b014fc8f86830f08c48fd')
  //   .then(function () {
  //     alert("copied");
  //     $scope.copied = "Address Copied Successfully...";
  //   }, function () {alert("Not copied");
  //     $scope.copied = "Not able to copy...";
  //   });
  // }
})

.controller('WalletCtrl', function($scope,$state, AppService, $q, PasswordPopup, Transactions, Friends, Items) {

   window.refresh = function () {
      $scope.balance = AppService.balance();
      $scope.account = AppService.account();
      $scope.qrcodeString = AppService.account();

      //temp
      $scope.transactions = Transactions.all();
      console.log($scope.transactions);
      console.log(Object.keys($scope.transactions).length);
      localStorage.Transactions = JSON.stringify($scope.transactions);
    };
   window.customPasswordProvider = function (callback) {
      var pw;
      PasswordPopup.open("Inserisci Una Password", "Inserisci La tua password").then(
        function (result) {
          pw = result;
          if (pw != undefined) {
            try {
              callback(null, pw);

            } catch (err) {
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: err.message

              });
              alertPopup.then(function (res) {
                console.log(err);
              });
            }
          }
        },
        function (err) {
          pw = "";
        })
    };

  $scope.isEmpty = function (obj) {
      for (var i in obj) if (obj.hasOwnProperty(i)) return false;
      return true;
  };

  if (typeof localStorage.AppKeys == 'undefined') {
    $scope.hasLogged = false;
    var extraEntropy = "LR Etherwallet";
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
    console.log('randomSeed: ' + randomSeed);
    var infoString = 'Your keystore seed is: "' + randomSeed +
        '". Please write it down on paper or in a password manager, you will need it to access your keystore. Do not let anyone see this seed or they can take your Ether. ' +
        'Please enter a password to encrypt your seed and you account while in the mobile phone.';

  } else {
      //retreive from localstorage
      var ls = JSON.parse(localStorage.AppKeys);
      code = JSON.parse(localStorage.AppCode).code;
      $scope.hasLogged = JSON.parse(localStorage.HasLogged);
      $scope.transactions = JSON.parse(localStorage.Transactions);

      global_keystore = new lightwallet.keystore.deserialize(ls.data);
      global_keystore.passwordProvider = customPasswordProvider;
      AppService.setWeb3Provider(global_keystore);
      $scope.qrcodeString = AppService.account();
      refresh();
    }

  $scope.Login = function (pw, cod) {

    password = pw;
    code = cod;

    global_keystore = new lightwallet.keystore(randomSeed, password);
    console.log(global_keystore);
    global_keystore.generateNewAddress(password, 1);
    global_keystore.passwordProvider = customPasswordProvider;

    AppService.setWeb3Provider(global_keystore);
    localStorage.AppKeys = JSON.stringify({data: global_keystore.serialize()});
    localStorage.AppCode = JSON.stringify({code: code});
    localStorage.HasLogged = JSON.stringify(true);
    localStorage.Transactions = JSON.stringify({});
    localStorage.Friends = JSON.stringify($scope.friends);
    localStorage.Items = JSON.stringify($scope.items);

    $scope.hasLogged = true;
    $scope.qrcodeString = AppService.account();

    refresh();

  }

})

.controller('sendCtrl', function($scope, $stateParams, $ionicModal, $state, $ionicPopup, $cordovaBarcodeScanner, AppService, Transactions) {

    window.refresh = function () {
      $scope.balance = AppService.balance();
      $scope.account = AppService.account();
      $scope.qrcodeString = AppService.account();

      //temp
      $scope.transactions = Transactions.all();
      console.log($scope.transactions);
      console.log(Object.keys($scope.transactions).length);
      localStorage.Transactions = JSON.stringify($scope.transactions);
    };
     window.customPasswordProvider = function (callback) {
      var pw;
      PasswordPopup.open("Inserisci Una Password", "Inserisci La tua password").then(
        function (result) {
          pw = result;
          if (pw != undefined) {
            try {
              callback(null, pw);

            } catch (err) {
              var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: err.message

              });
              alertPopup.then(function (res) {
                console.log(err);
              });
            }
          }
        },
        function (err) {
          pw = "";
        })
    };
  if (typeof localStorage.AppKeys == 'undefined') {
    $scope.hasLogged = false;
    var extraEntropy = "LR Etherwallet";
    var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
    console.log('randomSeed: ' + randomSeed);
    var infoString = 'Your keystore seed is: "' + randomSeed +
        '". Please write it down on paper or in a password manager, you will need it to access your keystore. Do not let anyone see this seed or they can take your Ether. ' +
        'Please enter a password to encrypt your seed and you account while in the mobile phone.';

  } else {
      //retreive from localstorage
      var ls = JSON.parse(localStorage.AppKeys);
      code = JSON.parse(localStorage.AppCode).code;
      $scope.hasLogged = JSON.parse(localStorage.HasLogged);
      $scope.transactions = JSON.parse(localStorage.Transactions);

      global_keystore = new lightwallet.keystore.deserialize(ls.data);
      global_keystore.passwordProvider = customPasswordProvider;
      AppService.setWeb3Provider(global_keystore);
      $scope.qrcodeString = AppService.account();
      refresh();
    }

    var TrueException = {};
    var FalseException = {};

    $scope.fromAddressBook = false;

    if($stateParams.addr){
      $scope.addrTo = $stateParams.addr;
      $scope.fromAddressBook = true;
    }else {
      $scope.fromAddressBook = false;
    }

    $scope.sendCoins = function (addr, amount) {
      var fromAddr = $scope.account;
      var toAddr = addr;
      var valueEth = amount;
      var value = parseFloat(valueEth) * 1.0e18;
      var gasPrice = 50000000000;
      var gas = 50000;

      AppService.sendTransaction(fromAddr, toAddr, value, gasPrice, gas).then(
        function (result) {
          if (result[0] != undefined) {
            var errorPopup = $ionicPopup.alert({
              title: 'Error',
              template: result[0]
            });
            errorPopup.then(function (res) {
              console.log(res);
            });
          } else {
            var successPopup = $ionicPopup.alert({
              title: 'Transazione Inoltrata',
              template: result[1]

            });
            successPopup.then(function (res) {
              $state.go('app.transactions');
            });
            //save transaction
            $scope.transactions = Transactions.save(fromAddr, toAddr, result[1], value, new Date().getTime());
            refresh();
          }
        },
        function (err) {
          var alertPopup = $ionicPopup.alert({
            title: 'Error',
            template: err

          });
          alertPopup.then(function (res) {
            console.log(err);
          });
        });
    };


   $scope.confirmSend = function (addr, amount) {
    var confirmPopup = $ionicPopup.confirm({
      title: 'Send Coins',
      template: 'Are you realy sure?'
    });
    confirmPopup.then(function (res) {
      if (res) {
        $scope.sendCoins(addr, amount);
      } else {
        console.log('Send coins aborted');
      }
    });
  };

  $scope.checkAddress = function (address) {
    try {
      angular.forEach(this.friends, function(value, key) {
        if(value.addr != address){
          throw TrueException;
        }else {
          throw FalseException;
        }
      })
    }catch (e){
      if(e === TrueException){
        $scope.toAdd = true;
      }else if(e===FalseException) {
        $scope.toAdd = false;
      }
    }
  }

  $scope.clearAddrTo = function(){
    $scope.fromAddressBook = false;
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
          $scope.values.mktcap = resp.data.market_cap.sort().pop()[1];
          $scope.values.price = resp.data.price.sort().pop()[1];
          $scope.values.volume = resp.data.volume.sort().pop()[1];
        });
      };
      $http.get('http://www.coincap.io/history/1day/ETH').then(function(resp) {
        $rootScope.hide($ionicLoading);
        $scope.values.mktcap = resp.data.market_cap.sort().pop()[1];
        $scope.values.price = resp.data.price.sort().pop()[1];
        $scope.values.volume = resp.data.volume.sort().pop()[1];
      });
      socket.on('trade', function (tradeMsg) {
        $localStorage.marketcap = tradeMsg;
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

    })

    .controller('PasscodeCtrl', function($scope, $http, $rootScope, $lockScreen) {

      $lockScreen.show({
        code: '1234',
        touchId: true,
        onCorrect: function () {
          console.log('correct!');
        },
        onWrong: function (attemptNumber) {
          console.log($scope.passcode);
          console.log(attemptNumber + ' wrong passcode attempt(s)');
        },
      });

      $scope.verifyPass = function() {

      };

    });
