// var lat;
// var lng;
'use strict';



var jingo = angular.module('jingo',['JingoServices']).
	config(['$routeProvider', function($routeProvider){
		$routeProvider
		.when('/splash', {templateUrl:'partials/splash.html', controller: SplashCtrl})
		.when('/login', {templateUrl:'partials/login.html'})
		.when('/feed', {templateUrl:'partials/feed.html', controller: FeedCtrl})
		.when('/makenote',{templateUrl:'partials/makenote.html', controller: NoteCtrl})
		.when('/profile',{templateUrl:'partials/profile.html', controller: ProfileCtrl})
		.when('/schedule/:schId',{templateUrl:'partials/schedule.html', controller: ScheduleCtrl})
		.when('/status',{templateUrl:'partials/status.html', controller: StatusCtrl})
		.otherwise({redirectTo:'/splash'});
	}]);

var service = angular.module('JingoServices', ['ui.bootstrap']);

