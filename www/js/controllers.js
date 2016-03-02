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

.controller('sendCtrlOld', function($scope, $http, $localStorage, $rootScope, $ionicLoading, $timeout, $ionicPopup) {

  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.shiftNow = function(data){
    var postData = {"btc": data.btc, "withdrawal": data.eth, cmail: data.cmail, "pair": "btc_eth", "returnAddress": data.btc, "apiKey": "8102aebfb2a73e643f88fd1e7b20cfef5bc7f3d1ea2e0d3a53a7657c9ff192724894dc2660c99783c0d145ce4de720301253265b2f6da381bae64b63e041f615"}

    $http.post('https://shapeshift.io/shift', postData).then(function(resp) {
      console.log(resp.data);
      if(resp.data.error) {
        $scope.show = function() {
          $ionicLoading.show({
            template: '<p>'+resp.data.error+'</p><ion-spinner></ion-spinner>'
          });
        };
        $scope.show($ionicLoading);
        $timeout(function() {
          data.btc = '',
          data.eth = '';
          data.cmail = '';
          $scope.hide($ionicLoading);
        }, 3000);

      } else {
        $scope.show = function() {
          $ionicLoading.show({
            template: '<p class="alert-success ion-ios-checkmark-outline"></p>'
          });
        };
        $scope.show($ionicLoading);
        $timeout(function() {
          data.btc = '',
          data.eth = '';
          data.cmail = '';
          $scope.hide($ionicLoading);
        }, 2000);
      }
    });
  };
})


.controller('sendCtrl', function($scope, $http, $localStorage, $rootScope, $ionicLoading, $timeout, $ionicPopup) {

  var web3 = new Web3();
  var global_keystore;
  $scope.setWeb3Provider = function(keystore) {
    var web3Provider = new HookedWeb3Provider({
      host: "http://localhost:8545",
      transaction_signer: keystore
    });
    web3.setProvider(web3Provider);
  }

  $scope.newAddresses = function(password) {

    if (password == '') {
      password = prompt('Enter password to retrieve addresses', 'Password');
    }
    var numAddr = parseInt(document.getElementById('numAddr').value)
    lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
      global_keystore.generateNewAddress(pwDerivedKey, numAddr);
      var addresses = global_keystore.getAddresses();
      document.getElementById('sendFrom').innerHTML = ''
      document.getElementById('functionCaller').innerHTML = ''
      for (var i=0; i<addresses.length; ++i) {
        document.getElementById('sendFrom').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'
        document.getElementById('functionCaller').innerHTML += '<option value="' + addresses[i] + '">' + addresses[i] + '</option>'
      }
      $scope.getBalances();
    })
  }
  $scope.getBalances = function() {

    var addresses = global_keystore.getAddresses();
    document.getElementById('addr').innerHTML = 'Retrieving addresses...'
    async.map(addresses, web3.eth.getBalance, function(err, balances) {
      async.map(addresses, web3.eth.getTransactionCount, function(err, nonces) {
        document.getElementById('addr').innerHTML = ''
        for (var i=0; i<addresses.length; ++i) {
          document.getElementById('addr').innerHTML += '<div>' + addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')' + '</div>'
        }
      })
    })
  }
  $scope.setSeed = function () {
    var password = prompt('Enter Password to encrypt your seed', 'Password');

    lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
      global_keystore = new lightwallet.keystore(
        document.getElementById('seed').value,
        pwDerivedKey);
        document.getElementById('seed').value = ''

        $scope.newAddresses(password);
        $scope.setWeb3Provider(global_keystore);

        $scope.getBalances();
      })
    }
    $scope.newWallet = function() {
      var extraEntropy = document.getElementById('userEntropy').value;
      document.getElementById('userEntropy').value = '';
      var randomSeed = lightwallet.keystore.generateRandomSeed(extraEntropy);
      var infoString = 'Your new wallet seed is: "' + randomSeed +
      '". Please write it down on paper or in a password manager, you will need it to access your wallet. Do not let anyone see this seed or they can take your Ether. ' +
      'Please enter a password to encrypt your seed while in the browser.'
      var password = prompt(infoString, 'Password');
      lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
        global_keystore = new lightwallet.keystore(
          randomSeed,
          pwDerivedKey);

          $scope.newAddresses(password);
          $scope.setWeb3Provider(global_keystore);
          $scope.getBalances();
        })
      }
      $scope.showSeed = function() {
        var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');
        lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
          var seed = global_keystore.getSeed(pwDerivedKey);
          alert('Your seed is: "' + seed + '". Please write it down.')
        })
      }
      $scope.sendEth = function() {
        var fromAddr = document.getElementById('sendFrom').value
        var toAddr = document.getElementById('sendTo').value
        var valueEth = document.getElementById('sendValueAmount').value
        var value = parseFloat(valueEth)*1.0e18
        var gasPrice = 50000000000
        var gas = 50000
        web3.eth.sendTransaction({from: fromAddr, to: toAddr, value: value, gasPrice: gasPrice, gas: gas}, function (err, txhash) {
          console.log('error: ' + err)
          console.log('txhash: ' + txhash)
        })
      }
      $scope.functionCall = function() {
        var fromAddr = document.getElementById('functionCaller').value
        var contractAddr = document.getElementById('contractAddr').value
        var abi = JSON.parse(document.getElementById('contractAbi').value)
        var contract = web3.eth.contract(abi).at(contractAddr)
        var functionName = document.getElementById('functionName').value
        var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']')
        var valueEth = document.getElementById('sendValueAmount').value
        var value = parseFloat(valueEth)*1.0e18
        var gasPrice = 50000000000
        var gas = 3141592
        args.push({from: fromAddr, value: value, gasPrice: gasPrice, gas: gas})
        var callback = function(err, txhash) {
          console.log('error: ' + err)
          console.log('txhash: ' + txhash)
        }
        args.push(callback)
        contract[functionName].apply(this, args)
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
          $scope.values.price = resp.data.price.sort().pop()[1];
          $scope.values.volume = resp.data.volume[0][1];
        });
      };
      $http.get('http://www.coincap.io/history/1day/ETH').then(function(resp) {
        $rootScope.hide($ionicLoading);
        $scope.values.mktcap = resp.data.market_cap[0][1];
        $scope.values.price = resp.data.price.sort().pop()[1];
        $scope.values.volume = resp.data.volume[0][1];
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
