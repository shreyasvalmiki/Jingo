service.factory('Feed', function($http, $q) {
	return {
		getNotes : function(lat, lng) {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'getnotes/' + String(lat) + '/' + String(lng)).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		getNotesByTag : function(tag) {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'getnotifbytag/' + String(tag)).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		getNotesByContent : function(tag) {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'getnotifbycontent/' + String(tag)).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		getNotesByLocation : function(lat,lng,radius) {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'getnotifbyloc/' + String(lat) + '/' + String(lng) + '/' +String(radius)).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		}
	}

});
