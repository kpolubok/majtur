angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, myCamera,/*$cordovaFileTransfer,*/AuthenticationService) {
	$scope.$on('$ionicView.loaded', function(){
		$scope.username = AuthenticationService.username();
	});

 /* document.addEventListener('deviceready', function () {
 console.log('DEVICE READY');
    var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
    var targetPath = cordova.file.documentsDirectory + "testImage.png";
    var trustHosts = true
    var options = {};

    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        // Success!
		$scope.lastPhoto = targetPath;
      }, function(err) {
        // Error
		$scope.error = err;
      }, function (progress) {
        $timeout(function () {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        })
      });

   }, false);*/

  $scope.getPhoto = function() {
    console.log('Getting camera');
    myCamera.getPicture({
      quality: 75,
      targetWidth: 320,
      targetHeight: 320,
      saveToPhotoAlbum: false
    }).then(function(imageURI) {
      console.log(imageURI);
      $scope.lastPhoto = imageURI;
    }, function(err) {
      console.err(err);
    });
	};
	
	$scope.upload = function() {
		/*var url = "http://cdn.wall-pix.net/albums/art-space/00030109.jpg";
		$scope.url = url;
		//var store = cordova.file.dataDirectory;
		if(cordova.file) {
			$scope.cd = 'cdf1';
		} else if(window.cordova.file) {
			$scope.cd = 'cdf2';
		} else {
			$scope.cd = 'no cdf';
		}
		//$scope.cd = store;
		var targetPath = 'android_asset/www/img/ionic.png';//cordova.file.documentsDirectory + "testImage.png";
		$scope.targetPath = targetPath;
		var trustHosts = true;
		var options = {};

    $cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        // Success!
		$scope.res = 'yay';
		$scope.lastPhoto = targetPath;
      }, function(err) {
        // Error
		$scope.res = 'nay';
		$scope.error = err;
      }, function (progress) {
        $timeout(function () {
          $scope.downloadProgress = (progress.loaded / progress.total) * 100;
        })
      });*/
	  
		var options = {
				fileKey: "avatar",
				fileName: "image.png",
				chunkedMode: false,
				mimeType: "image/png"
			};
		$cordovaFileTransfer.upload('http://majtur.pl/api/uploadphoto', 'android_asset/www/img/ionic.png', options)
		  .then(function(result) {
			// Success!
			$scope.res = 'yay';
			$scope.error = "SUCCESS: " + JSON.stringify(result);
		  }, function(err) {
			// Error
			$scope.res = 'nay';
			$scope.error = "Error: " + JSON.stringify(err);
		  }, function (progress) {
			// constant progress updates
			
			//console.log("ERROR: " + JSON.stringify(err));
		  });
	};
	
	/*document.addEventListener('deviceready', function () {
		var options = {
				fileKey: "avatar",
				fileName: "image.png",
				chunkedMode: false,
				mimeType: "image/png"
			};
		$cordovaFileTransfer.upload('http://localhost/app_dev.php/api/uploadphoto', 'www/img/ionic.png', options)
		  .then(function(result) {
			// Success!
			console.log("SUCCESS: " + JSON.stringify(result));
		  }, function(err) {
			// Error
		  }, function (progress) {
			// constant progress updates
			console.log("ERROR: " + JSON.stringify(err));
		  });

  }, false);*/
	
/*$scope.upload = function() {
        var options = {
            fileKey: "avatar",
            fileName: "image.png",
            chunkedMode: false,
            mimeType: "image/png"
        };
        $cordovaFile.uploadFile("http://localhost/app_dev.php/api/uploadphoto", "www/img/ionic.png", options).then(function(result) {
            console.log("SUCCESS: " + JSON.stringify(result.response));
        }, function(err) {
            console.log("ERROR: " + JSON.stringify(err));
        }, function (progress) {
            // constant progress updates
        });
    }*/
})

.controller('PlacesCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('PlaceDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope, AuthenticationService, $location) {  
	$scope.username = AuthenticationService.username();
	$scope.logout = function() {
		AuthenticationService.ClearCredentials();
		$location.path('/');
	};
})

.controller('AddCtrl', function($scope) {  
})









.controller('StepCtrl', function($scope, $stateParams, Travels) {
	$scope.data = {
		showDelete: false,
		showReorder: false
	};
	$scope.moveItem = function(item, fromIndex, toIndex) {
		$scope.step.places[fromIndex] = $scope.step.places.splice(toIndex, 1, $scope.step.places[fromIndex])[0];
	};
	$scope.onItemDelete = function(item) {
		$scope.step.places.splice($scope.step.places.indexOf(item), 1);
	};
	$scope.travelId = $stateParams.travelId;
	$scope.stepId = $stateParams.stepId;
	$scope.step = Travels.getStep($stateParams.travelId,$stateParams.stepId);
	console.log($scope.step);
	$scope.mode = 'show';
})

.controller('MapCtrl', function($scope, $ionicLoading, $compile, Geo) {
	var _this = this;
	$scope.$on('$ionicView.loaded', function(){
		console.log('loaded');
		initialize();
		$scope.refreshData();
	});
	$scope.$on('$ionicView.afterEnter', function(){
		console.log('after enter');
	});
	
	this.setCurrent = function(lat, lng) {
		var myLatlng = new google.maps.LatLng(lat,lng);
		$scope.map.setCenter(myLatlng);
		$scope.mymarker.setPosition(myLatlng);
	};
	
	$scope.refreshData = function() {
		Geo.getLocation().then(function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;

			/*Geo.reverseGeocode(lat, lng).then(function(locString) {
				$scope.currentLocationString = locString;
				_this.getBackgroundImage(lat, lng, locString);
			});*/
			_this.setCurrent(lat, lng);
		}, function(error) {
			alert('Unable to get current location: ' + error);
		});
	};
	
	//$scope.refreshData();
	
	/*$scope.showdialog = function(message) {
		$cordovaDialogs.alert(err, 'scopey', 'ok');
	};*/

	function initialize() {
		/*Geo.getLocation().then(function(position) {
			var lat = position.coords.latitude;
			var lng = position.coords.longitude;
		});*/
	
	
	
			
	
        var myLatlng = new google.maps.LatLng(0,0);
        
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        //Marker + infowindow + angularjs compiled ng-click
        var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
		  icon: {
			path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
				scale: 5
			},
          title: 'Tu jestem'
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;
		$scope.mymarker = marker;
      };
	  
      $scope.centerOnMe = function() {
        if(!$scope.map) {
          return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
      };
      
      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };      
    })
	
.controller('MapCtrl2', function($scope, $ionicLoading,$stateParams, Travels) {
	var _this = this;
	_this.initialized = false;
	$scope.travelId = $stateParams.travelId;
	$scope.stepId = $stateParams.stepId;
	
	$scope.mapCreated = function(map) {
		$scope.map = map;
		_this.directionsService = new google.maps.DirectionsService();
		_this.directionsDisplay = new google.maps.DirectionsRenderer();
		_this.directionsDisplay.setMap($scope.map);
		$scope.initRoute();
	};
	
	$scope.$on('$ionicView.afterEnter', function(){
		if(_this.initialized) {
			$scope.calcRoute();
		}
	});
	
	$scope.initRoute = function() {
		if (!$scope.map) {
			return;
		}
		/*$scope.loading = */$ionicLoading.show({
			content: 'Wyszukiwanie aktualnej pozycji...',
			showBackdrop: false
		});
		
		navigator.geolocation.getCurrentPosition(function(pos) {
			_this.currPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
		console.log(pos.coords.latitude);
		console.log(pos.coords.longitude);
			$scope.map.setCenter(_this.currPosition);
			$scope.calcRoute();
			$ionicLoading.hide();
			_this.initialized = true;
		}, function(error) {
			alert('Ustalenie lokalizacji niemożliwe : ' + error.message);
		});
	};

	$scope.centerOnMe = function() {
		console.log("Centering");
		if (!$scope.map) {
			return;
		}

		$scope.loading = $ionicLoading.show({
			content: 'Getting current location...',
			showBackdrop: false
		});

		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log('Got pos', pos);
			_this.currPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			$scope.map.setCenter(_this.currPosition);	
			//$scope.calcRoute();
			//$scope.loading.hide();
			$ionicLoading.hide();
		}, function(error) {
			alert('Unable to get location: ' + error.message);
		});
	};
	
	$scope.calcRoute = function() {
		//$scope.centerOnMe().then(console.log('CENTERED'));	
console.log('calcRoute');
		if (!_this.currPosition) { 
			return;
		};		
		var start = _this.currPosition;

		if(!$stateParams.travelId || !$stateParams.stepId) {
			return;
		}
		$scope.step = Travels.getStep($stateParams.travelId,$stateParams.stepId);
		if($scope.step.places.length < 1) {
			return;
		}
		var end = $scope.step.places[$scope.step.places.length-1];
		console.log('end:'+end);
		console.log(end.lat);
		console.log(end.lon);
		var endWaypoint = new google.maps.LatLng(end.lat, end.lon);		
		var waypoints = [];
		for (var i = 0; i < $scope.step.places.length-1; i++) {
			var address = $scope.step.places[i];
			if (address.lon &&  address.lat) {
				waypoints.push({
					location: new google.maps.LatLng(address.lat, address.lon),
					stopover: true
				});
			}
		};
		
		var request = {
			origin: start,
			destination: endWaypoint,
			waypoints: waypoints,
            optimizeWaypoints: true,
			travelMode: google.maps.TravelMode.DRIVING
		};
		_this.directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				_this.directionsDisplay.setDirections(response);
			}
		});
	}
})

/*** LOGIN ***/
.controller('LoginCtrl', function($scope, AuthenticationService, $location, $ionicLoading) {
	$scope.$on('$ionicView.beforeEnter', function(){
		AuthenticationService.ClearCredentials();
	});	
	$scope.message = "";

	$scope.user = {
		username: "tpsamia@gmail.com",
		password: "kajtus100"
	};

	$scope.login = function() {
		$ionicLoading.show({
			showBackdrop: true
		});
		
		AuthenticationService.Login($scope.user.username, $scope.user.password)
			.then(function(result) {
				response = result;
				if(response.success) {					
					AuthenticationService.SetCredentials(response.username, response.token);
					$ionicLoading.hide();
					$scope.user = {};
					$scope.message = "";
					$location.path('/');
				} else {
					$scope.message = response.message;
					$ionicLoading.hide();
				}
			}, function(err) {
				$scope.message = err.message;
				$ionicLoading.hide();
			});
	};
})
/*** SIGLE TRAVEL CONTROLLERS ***/
.controller('AddNoteStepCtrl', function($scope, $stateParams, Travels) {  
	$scope.travel = Travels.get($stateParams.travelId);
	$scope.description = 'Wybierz miejsce';
	$scope.mode = 'note';
})
.controller('AddPhotoStepCtrl', function($scope, $stateParams, Travels) {  
	$scope.travel = Travels.get($stateParams.travelId);
	$scope.description = 'Wybierz miejsce';
	$scope.mode = 'photo';
})
.controller('TravelDetailCtrl', function($scope, $stateParams, Travels) {
	$scope.travel = Travels.get($stateParams.travelId);
	$scope.description = $scope.travel.name;
	console.log($scope.travel);
	$scope.mode = 'show';
})
/*** LIST CONTROLLERS ***/
.controller('AddNoteCtrl', function($scope, Travels,$ionicLoading, $location) {
	$scope.description = 'Wybierz podróż';
	$scope.mode = 'note';
	
	$scope.refresh = function(force) {
		$ionicLoading.show({
			template: 'Pobieranie podróży...',
			showBackdrop: true
		});
		Travels.Fetch(force).then(
			function(result) {
				$scope.travels = Travels.all();
				$ionicLoading.hide();
			},
			function(err) {
				console.log(err);
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	};
	$scope.refresh(false);
})
.controller('TravelsCtrl', function($scope, $stateParams, Travels,$ionicLoading, $location) {
	$scope.description = 'Podróże';
	$scope.mode = 'show';
	
	$scope.refresh = function(force) {
		$ionicLoading.show({
			template: 'Pobieranie podróży...',
			showBackdrop: true
		});
		Travels.Fetch(force).then(
			function(result) {
				$scope.travels = Travels.all();
				$ionicLoading.hide();
			},
			function(err) {
				console.log(err);
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	};
	$scope.refresh(false);
})
.controller('AddPhotoCtrl', function($scope, Travels,$ionicLoading, $location) {  
	$scope.description = 'Wybierz podróż';
	$scope.mode = 'photo';
	
	$scope.refresh = function(force) {
		$ionicLoading.show({
			template: 'Pobieranie podróży...',
			showBackdrop: true
		});
		Travels.Fetch(force).then(
			function(result) {
				$scope.travels = Travels.all();
				$ionicLoading.hide();
			},
			function(err) {
				console.log(err);
				$location.path('/login');
				$ionicLoading.hide();
			}
		);
	};
	$scope.refresh(false);
})
/*** DETAILS CONTROLLERS ***/
.controller('AddPhotoDetailsCtrl', function($scope, $stateParams, Travels, myCamera, CRUDService, $ionicPopup, $ionicLoading, $location) {
	$scope.step = Travels.getStep($stateParams.travelId,$stateParams.stepId);
	$scope.message = '';
	$scope.post = {
		subject: null,
		photo: null,
	};
	
	$scope.save = function() {
		$ionicLoading.show({
			content: 'Przesyłanie...',
			showBackdrop: true
		});
		CRUDService.Image($scope.post.subject, $scope.post.photo, $scope.step.id)
		.then(function(response) {
			if (response.success) {
				$ionicLoading.hide();
				$scope.post = {
					subject: null,
					body: null,
					photo: null,
				};
				var confirmPopup = $ionicPopup.confirm({
					title: 'Zdjęcie dodane',
					template: 'Czy chcesz dodać kolejne zdjęcie?',
					cancelText: 'Anuluj',
					okText: 'OK'
				});
				confirmPopup.then(function(res) {
					if (res) {} else {
						$location.path('/');
					}
				});
			} else {
				$scope.message = response.message;
				$ionicLoading.hide();
			}
		}, function(err) {
			$scope.message = err.message;
			$ionicLoading.hide();
		});
	};
	
	$scope.getPhoto = function() {
		myCamera.getPicture({
			quality: 75,
			targetWidth: 320,
			targetHeight: 320,
			destinationType: 0
		}).then(function(imageData) {
			var image = document.getElementById('image-preview');
			image.src = "data:image/jpeg;base64," + imageData;
			$scope.post.photo = dataURItoBlob("data:image/jpeg;base64,"+imageData);
		}, function(err) {
			$scope.lastPhoto = 'nay' + err;
		});
	};
})
.controller('AddNoteDetailsCtrl', function($scope, $stateParams, Travels, myCamera, CRUDService, $ionicPopup, $ionicLoading, $location) {
	$scope.step = Travels.getStep($stateParams.travelId,$stateParams.stepId);
	$scope.message = '';
	$scope.post = {
		subject: null,
		body: null,
		photo: null,
	};
	
	$scope.save = function() {
		$ionicLoading.show({
			content: 'Przesyłanie...',
			showBackdrop: true
		});
		CRUDService.Post($scope.post.subject, $scope.post.body, $scope.post.photo, $scope.step.id)
		.then(function(response) {
			if (response.success) {
				$ionicLoading.hide();
				$scope.post = {
					subject: null,
					body: null,
					photo: null,
				};
				var confirmPopup = $ionicPopup.confirm({
					title: 'Wpis dodany',
					template: 'Czy chcesz dodać kolejny wpis?',
					cancelText: 'Anuluj',
					okText: 'OK'
				});
				confirmPopup.then(function(res) {
					if (res) {} else {
						$location.path('/');
					}
				});
			} else {
				$scope.message = response.message;
				$ionicLoading.hide();
			}
		}, function(err) {
			$scope.message = err.message;
			$ionicLoading.hide();
		});
	};
	
	$scope.getPhoto = function() {
		myCamera.getPicture({
			quality: 75,
			targetWidth: 320,
			targetHeight: 320,
			destinationType: 0
		}).then(function(imageData) {
			var image = document.getElementById('image-preview');
			image.src = "data:image/jpeg;base64," + imageData;
			$scope.post.photo = dataURItoBlob("data:image/jpeg;base64,"+imageData);
		}, function(err) {
			$scope.lastPhoto = 'nay' + err;
		});
	};
})
.controller('AddPlaceCtrl', function($scope,$ionicLoading, myCamera, CRUDService, $ionicPopup, $location,Chats) { 
	_this = this;
	$scope.mapCreated = function(map) {
		console.log("mapCreated");
		$scope.map = map;
		
		var marker = new google.maps.Marker({
          map: map,
          title: 'Tu jestem'
        });
		$scope.mymarker = marker;		
		$scope.centerOnMe();
	}
	
	$scope.centerOnMe = function() {
		console.log("Centering");
		if (!$scope.map) {
			return;
		}
		$scope.loading = $ionicLoading.show({
			content: 'Wyszukiwanie aktualnej lokalizacji...',
			showBackdrop: false
		});

		navigator.geolocation.getCurrentPosition(function(pos) {
			$scope.longitude = pos.coords.longitude;
			$scope.latitude = pos.coords.latitude;
			_this.currPosition = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
			$scope.map.setCenter(_this.currPosition);
			$scope.mymarker.setPosition(_this.currPosition);
			$ionicLoading.hide();
		}, function(error) {
			alert('Unable to get location: ' + error.message);
		});
	};
	
	$scope.place = {
		name: null,
		description: null,
		photo: null,
		type: null
	};
		
	$scope.save = function() {
		$ionicLoading.show({
			content: 'Przesyłanie...',
			showBackdrop: true
		});
		CRUDService.Place($scope.place.name, $scope.place.description, $scope.place.photo, $scope.longitude, $scope.latitude, $scope.place.type)
		.then(function(response) {
			console.log(response);
			console.log(response.success);
			if (response.success) {
				Chats.add($scope.place.name,$scope.place.description,$scope.place.photo);
				$ionicLoading.hide();
				$scope.place = {
					name: null,
					description: null,
					photo: null,
					type: null
				};
				
				var alertPopup = $ionicPopup.alert({
					title: 'Miejsce dodane',
					//template: 'Miejsce dodane'
				});
				alertPopup.then(function(res) {
					$location.path('/');
				});
				
				/*var confirmPopup = $ionicPopup.confirm({
					title: 'Wpis dodany',
					template: 'Czy chcesz dodać kolejny wpis?',
					cancelText: 'Anuluj',
					okText: 'OK'
				});
				confirmPopup.then(function(res) {
					if (res) {} else {
						$location.path('/');
					}
				});*/
			} else {
				$scope.message = response.message;
				$ionicLoading.hide();
			}
		}, function(err) {
			$scope.message = err.message;
			$ionicLoading.hide();
		});	
	};
	
	$scope.getPhoto = function() {
		myCamera.getPicture({
			quality: 75,
			targetWidth: 320,
			targetHeight: 320,
			destinationType: 0
		}).then(function(imageData) {
			var image = document.getElementById('image-preview');
			image.src = "data:image/jpeg;base64," + imageData;
			$scope.post.photo = dataURItoBlob("data:image/jpeg;base64,"+imageData);
		}, function(err) {
			$scope.lastPhoto = 'nay' + err;
		});
	};
})
;

function dataURItoBlob(dataURI) {
	// convert base64/URLEncoded data component to raw binary data held in a string
	var byteString = atob(dataURI.split(',')[1]);
	var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

	var ab = new ArrayBuffer(byteString.length);
	var ia = new Uint8Array(ab);
	for (var i = 0; i < byteString.length; i++)
	{
		ia[i] = byteString.charCodeAt(i);
	}

	var bb = new Blob([ab], { "type": mimeString });
	return bb;
};
