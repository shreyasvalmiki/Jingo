function Coordinates() {

	this.lat = 0.0;
	this.lng = 0.0;
}

function getCoordinates() {
	//alert("in");
	var coord = new Coordinates();
	if (Modernizr.geolocation) {
		navigator.geolocation.getCurrentPosition(function(pos) {
			coord.lat = pos.coords.latitude;
			coord.lng = pos.coords.longitude;
		});
	} else {
		alert("Geolocation not available.")
		return null;
	}
};

var curLat = 0.0;
var curLng = 0.0;

var lat = 0.0;
var lng = 0.0;

var mapLat = 0.0;
var mapLng = 0.0;

var isPhone = false;

var map = new Object();

var marker = new Object();
var interval = null;
function updateMarkerPosition(pos) {
	mapLat = pos.lat();
	mapLng = pos.lng();
	interval = null;
	interval = setTimeout(function() {
		map.panTo(marker.getPosition());
	}, 3000);
}

function initMap() {
	mapLat = lat;
	mapLng = lng;
	var mapOptions = {
		center : new google.maps.LatLng(mapLat, mapLng),
		zoom : 15,
		mapTypeId : google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
	marker = new google.maps.Marker({
		position : new google.maps.LatLng(mapLat, mapLng),
		map : map,
		draggable : true
	});
	
	google.maps.event.addListener(map, 'click', function(event) {
		marker.setPosition(event.latLng);
		interval = null;
		interval = setTimeout(function() {
			map.panTo(marker.getPosition());
		}, 3000);
		mapLat = event.latLng.lat();
		mapLng = event.latLng.lng();
	});

	google.maps.event.addListener(map, 'center_changed', function() {
		interval = null;
		interval = setTimeout(function() {
			map.panTo(marker.getPosition());
		}, 10000);
	});

	google.maps.event.addListener(marker, 'dragend', function() {
		updateMarkerPosition(marker.getPosition());
	});

	navigator.geolocation.getCurrentPosition(function(pos) {
		isPhone = true;
		mapLat = pos.coords.latitude;
		mapLng = pos.coords.longitude;
		map.setCenter(new google.maps.LatLng(mapLat, mapLng));
		marker.setPosition(new google.maps.LatLng(mapLat, mapLng));
	});

	if (!isPhone) {
		mapLat = geoip_latitude();
		mapLng = geoip_longitude();
		map.setCenter(new google.maps.LatLng(mapLat, mapLng));
		marker.setPosition(new google.maps.LatLng(mapLat, mapLng));
	}
}

function placeMarker(location) {
	marker.position = location;
}