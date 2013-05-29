service.factory('Login', function($http, $q) {
	return {
		isLoggedIn : function() {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'isloggedin').success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		getDummy : function() {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'dummy').success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},

		verifyUser : function(data) {
			var deferred = $q.defer();
			$http.post(REST_ROOT + 'verifyuser', data).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		
		logout : function() {
			var deferred = $q.defer();
			$http.post(REST_ROOT + 'logout').success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		
		newUser : function(data) {
			var deferred = $q.defer();
			$http.post(REST_ROOT + 'newuser', data).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		
		isExistingUser : function(data) {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'isexistinguser/'+data).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		}
	}

});