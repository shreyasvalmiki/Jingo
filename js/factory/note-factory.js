service.factory('Note', function($http, $q) {
	return{
		addNote : function(data) {
			var deferred = $q.defer();
			$http.post(REST_ROOT + 'addnote', data).success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		},
		getPrivOps : function(data) {
			var deferred = $q.defer();
			$http.get(REST_ROOT + 'getprivops').success(function(out) {
				deferred.resolve(out);
			}).error(function() {
				deferred.reject();
			});
			return deferred.promise;
		}
	}
});