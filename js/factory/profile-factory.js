service.factory('Profile', function($http, $q) {
	return {
		getMyStatuses : function() {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'getmystatuses').success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		getMySchedules : function() {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'getmyscheds').success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		makeCurrStatus : function(currStatusNm) {
			var deferred = $q.defer();
			$http.post(REST_ROOT + 'makecurrstatus/'+currStatusNm).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		addStatus : function(data) {
			var deferred = $q.defer();
			$http.post(REST_ROOT + 'addstatus',data).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		}
		
	}

});
