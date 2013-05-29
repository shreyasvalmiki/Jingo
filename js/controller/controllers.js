'use strict';

var useMap = false;
var radiuses = [{
		r : 0.1,
		text : "mile"
	}, {
		r : 0.5,
		text : "mile"
	}, {
		r : 1,
		text : "mile"
	}, {
		r : 2,
		text : "miles"
	}, {
		r : 3,
		text : "miles"
	}, {
		r : 4,
		text : "miles"
	}, {
		r : 5,
		text : "miles"
	}, {
		r : 10,
		text : "miles"
	}, {
		r : 20,
		text : "miles"
	}, {
		r : 50,
		text : "miles"
	}, {
		r : 100,
		text : "miles"
	}];
function LoginCtrl($scope, Login) {
	$scope.logout = function() {
		Login.logout().then(function(data) {
			window.location = "#/login";
		});
	}

	$scope.signin = function() {

		var userNm = $scope.userNm;
		var passwd = $scope.passwd;

		if (userNm == null || passwd == null || userNm == "" || passwd == "") {
			alert("Fields cannot be empty");
		} else {
			passwd = MD5(passwd);
			//alert(passwd);
			var req = JSON.stringify({
				"userNm" : userNm,
				"passwd" : passwd
			});
			Login.verifyUser(req).then(function(data) {
				var result = data;

				if (result == "true") {
					alert("You are logged in");
					window.location = gotoPartial;
				} else {
					alert("Incorrect username/password combination")
				}

			});
		}

	}

	$scope.register = function() {

		var userNm = $scope.regUserNm;
		var passwd = $scope.regPasswd;
		var confPasswd = $scope.regConfPasswd;
		var email = $scope.regEmail;

		if (userNm == null || passwd == null || email == null || userNm == "" || passwd == "" || email == "") {
			alert("Fields cannot be empty");
		} else if (passwd != confPasswd) {
			alert("Passwords do not match");
		} else {
			Login.isExistingUser(userNm).then(function(data) {
				var isExisting = data;
				//alert(isExisting);
				if (isExisting == "false") {
					passwd = MD5(passwd);
					//alert(passwd);
					var req = JSON.stringify({
						"userNm" : userNm,
						"passwd" : passwd,
						"email" : email
					});
					//alert(req);
					Login.newUser(req).then(function(data) {
						var result = data;

						alert(data);
						window.location = gotoPartial;

					});
				} else {
					alert("Username exists. Choose a different one.");
				}
			});
		}
	}
}

function isLoggedIn(Login) {
	Login.isLoggedIn().then(function(data) {
		var loginRes = data;
		//alert("in");
		if (loginRes != "false") {
			window.location = gotoPartial;
			user = loginRes;
		} else {
			window.location = "#/login";
		}

	});
}

function SplashCtrl($scope, Login) {
	isLoggedIn(Login);
}

var feedCall;
function periodicCall(useMap, Feed) {
	var notes = new Object();
	alert(isPhone);
	//alert("in");
	//alert(isPhone);
	if (!useMap && isPhone) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			lat = pos.coords.latitude;
			lng = pos.coords.longitude;
			Feed.getNotes(lat, lng).then(function(data) {
				notes = data;
			});
			isPhone = true;
		});
	} else if (!useMap && !isPhone) {
		alert("in");
		lat = geoip_latitude();
		lng = geoip_longitude();
		Feed.getNotes(lat, lng).then(function(data) {
			notes = data;
		});
	} else {
		Feed.getNotes(mapLat, mapLng).then(function(data) {
			notes = data;
		});
	}
	Feed.getNotes(lat, lng).then(function(data) {
		notes = data;
	});

}

function FeedCtrl($scope, Login, Feed) {
	gotoPartial = "#/feed";
	isLoggedIn(Login);
	//initMap();
	$scope.useMap = false;
	var localLat = 0.0;
	var localLng = 0.0;
	
	$scope.criterias = [{"text":"Content"},{"text":"Location"},{"text":"Tags"}];
	$scope.criteria = $scope.criterias[0];
	
	$scope.search = function(){
		feedCall = null;
		if($scope.criteria.text == "Content"){
			Feed.getNotesByContent($scope.searchTxt).then(function(data){
				$scope.notes = data;
			});
		}
		
		else if($scope.criteria.text == "Tags"){
			//alert("in");
			Feed.getNotesByTag($scope.searchTxt).then(function(data){
				$scope.notes = data;
			});
		}
		
		else{
			Feed.getNotesByLocation(mapLat, mapLng, $scope.searchTxt).then(function(data){
				alert(JSON.stringify(data));
				$scope.notes = data;
			});
		}
		
	}

	navigator.geolocation.getCurrentPosition(function(pos) {
		lat = pos.coords.latitude;
		lng = pos.coords.longitude;
		Feed.getNotes(lat, lng).then(function(data) {
			$scope.notes = data;
		});
		isPhone = true;
	});
	feedCall = null;
	feedCall = setInterval(function() {
		//alert("in");
		//$scope.notes = periodicCall($scope.useMap,Feed);
		if (!useMap && isPhone) {
			navigator.geolocation.getCurrentPosition(function(pos) {
				lat = pos.coords.latitude;
				lng = pos.coords.longitude;
				Feed.getNotes(lat, lng).then(function(data) {
					$scope.notes = data;
				});
				isPhone = true;
				//alert("in");
			});
		} else if (!useMap && !isPhone) {
			//alert("in");
			lat = geoip_latitude();
			lng = geoip_longitude();
			Feed.getNotes(lat, lng).then(function(data) {
				$scope.notes = data;
			});
		} else if (useMap) {
			Feed.getNotes(mapLat, mapLng).then(function(data) {
				$scope.notes = data;
			});
		}
		// Feed.getNotes(lat, lng).then(function(data) {
		// notes = data;
		// });
	}, 3000);
}

function NoteCtrl($scope, Login, Note) {

	gotoPartial = "#/makenote";
	isLoggedIn(Login);
	//initMap();
	$scope.radiuses = radiuses;
	$scope.radius = $scope.radiuses[2];
	Note.getPrivOps().then(function(data) {
		$scope.privOps = data;
		$scope.privacy = $scope.privOps[0];
	});
	$scope.useMap = false;
	$scope.allowCommVal = true;
	$scope.shouldRecurVal = true;
	$scope.allowComm = "y";
	$scope.shouldRecur = "y";
	$scope.allowCommChanged = function() {
		if ($scope.allowCommVal) {
			$scope.allowComm = "y";
		} else {
			$scope.allowComm = "n";
		}
	}
	$scope.shouldRecurChanged = function() {
		if ($scope.shouldRecurVal) {
			$scope.shouldRecur = "y";
		} else {
			$scope.shouldRecur = "n";
		}
	}
	$scope.push = function() {
		if (String($scope.noteTxt).trim() == "" || $scope.noteTxt == null) {
			alert("Note cannot be empty");
		} else {
			var dtTime = moment().format("YYYY-MM-DD HH:mm:ss");

			var topics = new Array();
			topics = String($scope.noteTxt).match(/#(\w+)/gi);
			if (topics != null && topics.length > 0) {
				for (var i = 0; i < topics.length; i++) {
					topics[i] = topics[i].substring(1).toLowerCase();
				}
			} else {
				topics = ["misc"];
			}
			var noteData = "";
			if (useMap) {
				navigator.geolocation.getCurrentPosition(function(pos) {
					lat = pos.coords.latitude;
					lng = pos.coords.longitude;
					noteData = JSON.stringify({
						"noteTxt" : $scope.noteTxt,
						"topics" : topics,
						"allowComm" : $scope.allowComm,
						"shouldRecur" : $scope.shouldRecur,
						"lat" : lat,
						"lng" : lng,
						"dtTime" : dtTime,
						"radius" : $scope.radius.r,
						"privId" : $scope.privacy.privId,
						"schId" : 1
					});
				});
				if (noteData == "") {
					lat = geoip_latitude();
					lng = geoip_longitude();
					noteData = JSON.stringify({
						"noteTxt" : $scope.noteTxt,
						"topics" : topics,
						"allowComm" : $scope.allowComm,
						"shouldRecur" : $scope.shouldRecur,
						"lat" : lat,
						"lng" : lng,
						"dtTime" : dtTime,
						"radius" : $scope.radius.r,
						"privId" : $scope.privacy.privId,
						"schId" : 1
					});
				}
			} else {
				lat = mapLat;
				lng = mapLng;
				noteData = JSON.stringify({
					"noteTxt" : $scope.noteTxt,
					"topics" : topics,
					"allowComm" : $scope.allowComm,
					"shouldRecur" : $scope.shouldRecur,
					"lat" : lat,
					"lng" : lng,
					"dtTime" : dtTime,
					"radius" : $scope.radius.r,
					"privId" : $scope.privacy.privId,
					"schId" : 1
				});
			}
			Note.addNote(noteData).then(function(data) {
				alert(data);
				window.location = "#/feed";
			});
			//alert(noteData);

		}

	}
}
function ScheduleCtrl($scope, Login, Schedule){
	
}
function ProfileCtrl($scope, Login, Profile){
	gotoPartial = "#/profile";
	isLoggedIn(Login);
	
	$scope.newStatus = function(){
		window.location = "#/status";
	}
	
	$scope.save = function(){
		Profile.makeCurrStatus($scope.chosen.statusNm).then(function(data){
			alert("Setting Saved");
		});
	}
	Profile.getMyStatuses().then(function(data){
		$scope.statuses = data;
		
		for(var i=0; i<$scope.statuses.length; i++){
			if($scope.statuses[i].isCurrStatus == 'y'){
				$scope.chosen=$scope.statuses[i];
				//alert($scope.chosen);
			}
		}
		
		
	});
	
	Profile.getMySchedules().then(function(data){
		$scope.schedules = data;
	});
	
}

function StatusCtrl($scope,Login, Profile, Note){
	gotoPartial = "#/status";
	isLoggedIn(Login);
	
	Note.getPrivOps().then(function(data) {
		//alert(data);
		$scope.privOps = data;
		$scope.privacy = $scope.privOps[0];
	});
	
	$scope.radiuses = radiuses;
	
	$scope.radius = $scope.radiuses[2];
	
	$scope.save = function(){
		if(String($scope.statusNm).trim() == ""){
			alert("Name cannot be empty");
		}
		else{
			var req = JSON.stringify({
				"statusNm":$scope.statusNm,
				"statusMsg":$scope.statusMsg,
				"radius":$scope.radius.r,
				"privId":$scope.privacy.privId
			});
			//alert(req);
			Profile.addStatus(req).then(function(data){
				alert(data);
				window.location = "#/profile";
			});
			
		}
	}
	
}
function RootCtrl($scope, Login) {
	isLoggedIn(Login);
	$scope.useMap = false;
	$scope.useMapChanged = function() {
		useMap = $scope.useMap;
	}
	initMap();
}
