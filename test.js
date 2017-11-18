var map;
var markers = [];
var placeType = 'hospital';
var center = {lat: 10.4806, lng: -66.9036};

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: center,
		zoom: 15
	});

	var cmarker = new google.maps.Marker({
		position: center,
		map: map,
		draggable: true,
		title: "Drag me!",
	});

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			center = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			cmarker.setPosition(center);
			map.setCenter(center);
		}, function() {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

	infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: center,
			radius: 500,
			type: [placeType]
		}, callback);

	cmarker.addListener('dragend', function() {
    center = cmarker.getPosition()
    map.setCenter(center);

		infowindow = new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch({
			location: center,
			radius: 500,
			type: [placeType]
		}, callback);
	});
}

function callback(results, status) {
	if (status === google.maps.places.PlacesServiceStatus.OK) {
		for (var i=0; i<markers.length; i++) {
	    markers[i].setMap(null);
  	}
  	markers.length = 0;
		for (var i=0; i<results.length; i++) {
			createMarker(results[i]);
		}
	}
}

function createMarker(place) {
	var placeLoc = place.geometry.location;
	var icon = {
		url: place.icon,
		size: new google.maps.Size(71, 71),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(17, 34),
		scaledSize: new google.maps.Size(25, 25)
	};

	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location,
		icon: icon
	});

	markers.push(marker);

	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
}

function changeType(newPlaceType) {
	placeType = newPlaceType;
	infowindow = new google.maps.InfoWindow();
	var service = new google.maps.places.PlacesService(map);
	service.nearbySearch({
		location: center,
		radius: 500,
		type: [placeType]
	}, callback);
}