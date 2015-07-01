angular.module('starter.services', [])

.factory('CRUDService', function($rootScope,$localstorage,$http,$rootScope, $q, ApiEndpoint) {
	var token = $rootScope.globals.currentUser.token;
	return {
		Post: function(subject,body,photo,stepid){		
			var q = $q.defer();
			$http.post(ApiEndpoint.url+'newpost',{ subject: subject, body: body, photo: photo, sid: stepid, token: token })
				.success(function (response) {				
					q.resolve(response);
                })
				.error(function(response) {
					q.reject(response);
				});
			return q.promise;
		},
		Image: function(subject,body,photo,stepid){			
			$http.post(ApiEndpoint.url+'newimage',{ photo: photo, sid: stepid, token: token })
				.success(function (response) {				
					q.resolve(response);
                })
				.error(function(response) {
					q.reject(response);
				});
			return q.promise;
		},
		Place: function(name,description,photo,longitude,latitude,type){
			var q = $q.defer();
			$http.post(ApiEndpoint.url+'newplace',{ name:name, description:description, photo:photo, longitude:longitude, latitude:latitude, type:type, token:token })
				.success(function (response) {	
					q.resolve(response);
                })
				.error(function(response) {
					q.reject(response);
				});
			return q.promise;
		}
	}
})

.factory('AuthenticationService', function($rootScope,$localstorage,$http, $q, ApiEndpoint) {
	return {
		username: function() {
			return $rootScope.globals.currentUser.username;
		},
		Login: function(username,password){
			var q = $q.defer();
			//$http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded";
			$http.post(ApiEndpoint.url+'login',{ username: username, password: password })
				.success(function(data) {
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;
		},
		SetCredentials: function (username, token) {  
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    token: token
                },			
            };
            $localstorage.setObject('globals', $rootScope.globals);
        },  
        ClearCredentials: function () {
            $rootScope.globals = {};
            $localstorage.setObject('globals', null);
        }
	}
})

.factory('myCamera', ['$q', function($q) {
 
  return {
    getPicture: function(options) {
      var q = $q.defer();
      
      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);
      
      return q.promise;
    }
  }
}])

.factory('Travels', function($http,$rootScope,$q,ApiEndpoint,$localstorage) {
	var _this = this;
	var travels = null;
	var token = $rootScope.globals.currentUser.token;

  return {
	Fetch: function(force){		
		force = typeof force !== 'undefined' ? force : false;
		console.log(force);
		var q = $q.defer();
		if(!force) {
			//sprawdz czy jest
			//console.log('szukamy db');console.log(travels);
			if(travels) {
			//console.log('zwroc travels');
				q.resolve(travels);
				return q.promise;
			}
		}
		console.log('web  travels');
			
			$http.get(ApiEndpoint.url+'travels/'+encodeURIComponent(token))
				.success(function(data) {  
console.log(data);				
					travels = data.data;
					q.resolve(data);
				})
				.error(function(error){
					q.reject(error);
				});
			return q.promise;
		},
    /*fetch: function(callback) {
		if(!travels) {
			$http.get('http://majtur.pl/api/travels/'+encodeURIComponent(token))
				.success(function (response) {
					console.log(response);
					//callback(response.data);
					travels = response.data;
					console.log(travels);
					//return travels;
					callback();
				});
		} else {
			callback();
		}
	},*/
    all: function() {
	//console.log(travels);
	
	/*if(travels.length) {	console.log('cos jest'); } else { console.log('nic nie ma'); }
		if(travels.length == 0) {
		console.log('fetching');
			return this.fetch();
			console.log('fetchedd');
		}*/
      return travels;
    },
    /*remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },*/
    get: function(travelId) {
      for (var i = 0; i < travels.length; i++) {
        if (travels[i].id === parseInt(travelId)) {
          return travels[i];
        }
      }
      return null;
    },
	getStep: function(travelId,stepId) {
      for (var i = 0; i < travels.length; i++) {
        if (travels[i].id === parseInt(travelId)) {
			for (var j = 0; j < travels[i].steps.length; j++) {
				if (travels[i].steps[j].id === parseInt(stepId)) {
					return travels[i].steps[j];
				}
			}          
        }
      }
	}
  };
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [];
    /*id: 0,
    name: 'Browar tyski',
    lastText: 'W czasie zwiedzania mozna napić się piwa',
    face: 'http://mw2.google.com/mw-panoramio/photos/thumbnail/33949067.jpg'
  }, {
    id: 1,
    name: 'Tyski rynek',
    lastText: 'Na rynku restauracja z dobra pizzą i lody kręcone',
    face: 'http://mw2.google.com/mw-panoramio/photos/thumbnail/39179626.jpg'
  }, {
    id: 2,
    name: 'Kościół MArii Magdaleny',
    lastText: 'Najstarszy tyski kosciół. W środku piekne witraże i rzeźby z okresu baroko-rokoko',
    face: 'http://mw2.google.com/mw-panoramio/photos/thumbnail/58394961.jpg'
  }];*/

  return {
	add:function(name,description,image) {
	console.log(name);
	console.log(description);
	console.log(image);
		var newid = chats.length;
		var obj = {
			id: newid,
			name: name,
			lastText: description,
			face: image
		  };
		chats.unshift(obj);
	},
    all: function() {
	console.log(chats);
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})

//angular.module('ionic.weather.services', ['ngResource'])
.factory('Geo', function($q) {
	return {
		getLocation: function() {
			var q = $q.defer();
			
			navigator.geolocation.getCurrentPosition(function(position) {
				q.resolve(position);
			}, function(error) {
				q.reject(error);
			});
			return q.promise;
		}
	};
});

angular.module('ionic.utils', [])

.factory('$localstorage', ['$window', function($window) {
	var prefix = 'prefix_plmajtur';
  return {
    set: function(key, value) {
      $window.localStorage[prefix+key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[prefix+key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[prefix+key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[prefix+key] || '{}');
    }
  }
}]);
