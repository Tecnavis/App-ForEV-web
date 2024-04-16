var markerDetailsArray = []; // Array to store marker details
var map;
var markers = []; // Array to store markers
var currentLocation;

function initMap() {
    if (navigator.geolocation) {
        // Request current position
        navigator.geolocation.getCurrentPosition(function (position) {
            // Get current coordinates
            currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Create map centered at the current location
            map = new google.maps.Map(document.getElementById('map'), {
                center: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                zoom: 15
            });

            // Add marker for current location with custom icon
            var currentLocationMarker = new google.maps.Marker({
                position: {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                },
                map: map,
                icon: {
                    url: './location.png', // Path to your custom icon
                    scaledSize: new google.maps.Size(50, 50) // Adjust size here
                },
                title: 'Current Location'
            });


            var directionsService = new google.maps.DirectionsService;
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map
            });

            // var originInput = document.getElementById('origin-input');
            // var destinationInput = document.getElementById('destination-input');
            // var navigateButton = document.getElementById('navigateButton');
            var nearbyEVSButton = document.getElementById('nearbyEVS');
            var radiusInput = document.getElementById('radiusInput');

            // var originAutocomplete = new google.maps.places.Autocomplete(originInput);
            // var destinationAutocomplete = new google.maps.places.Autocomplete(destinationInput);

            // function calculateAndDisplayRoute() {
            //     directionsService.route({
            //         origin: originInput.value,
            //         destination: destinationInput.value,
            //         travelMode: 'DRIVING'
            //     }, function (response, status) {
            //         if (status === 'OK') {
            //             directionsDisplay.setDirections(response);
            //             var start = originInput.value;
            //             var end = destinationInput.value;
            //             navigateButton.href = "list.html?start=" + encodeURIComponent(start) + "&end=" + encodeURIComponent(end);

            //             // Call function to display EV stations along the route
            //             displayEVStationsAlongRoute(response.routes[0].overview_path);
            //         } else {
            //             window.alert('Directions request failed due to ' + status);
            //         }
            //     });
            // }

            // function updateRangeValue() {
            //     console.log("Updating range value...");
            //     var range = document.getElementById("radiusRange");
            //     var value = document.getElementById("scrollValue");
            //     value.innerText = range.value;
            //     console.log("New value:", range.value);
            // }

            // function updateScrollValue() {
            //     console.log("Updating scroll value...");
            //     var input = document.getElementById("radiusInput");
            //     var value = document.getElementById("scrollValue");
            //     value.innerText = input.value;
            //     console.log("New value:", input.value);
            // }


            function displayEVStationsAlongRoute(path) {
                // Clear existing markers
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];

                // Loop through the route path and get EV stations within a radius at each point
                path.forEach(function (point) {
                    var request = {
                        location: point,
                        radius: 50, // 5 m radius
                        keyword: 'ev station'
                    };

                    var service = new google.maps.places.PlacesService(map);
                    service.nearbySearch(request, function (results, status) {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            results.forEach(function (place) {
                                // Add a marker for each EV station found
                                var marker = new google.maps.Marker({
                                    map: map,
                                    position: place.geometry.location,
                                    title: place.name
                                });

                                // Add click event listener to the marker
                                marker.addListener('click', function () {
                                    handleMarkerClick(marker, place);
                                });

                                markers.push(marker); // Add marker to the array
                            });
                        }
                    });
                });
            }

            navigateButton.addEventListener('click', function () {
                calculateAndDisplayRoute();
            });

            nearbyEVSButton.addEventListener('click', function () {
                // Clear existing markers
                markers.forEach(function (marker) {
                    marker.setMap(null);
                });
                markers = [];
                // Trigger nearby search with the updated radius
                displayNearbyEVStations();
            });
        });
    }
}

function updateRangeValue() {
    console.log("Updating range value...");
    var range = document.getElementById("radiusRange");
    var value = document.getElementById("scrollValue");
    value.innerText = range.value;
    console.log("New value:", range.value);
}

function updateScrollValue() {
    console.log("Updating scroll value...");
    var input = document.getElementById("radiusInput");
    var value = document.getElementById("scrollValue");
    value.innerText = input.value;
    console.log("New value:", input.value);
}

// // Function to display EV stations along the route
function displayEVStationsAlongRoute(path) {
    // Clear existing markers
    markers.forEach(function (marker) {
        marker.setMap(null);
    });
    markers = [];

    // Loop through the route path and get EV stations within a radius at each point
    path.forEach(function (point) {
        var request = {
            location: point,
            radius: 5000, // 5 km radius
            keyword: 'ev station'
        };

        var service = new google.maps.places.PlacesService(map);
        service.nearbySearch(request, function (results, status) {
            if (status === google.maps.places.PlacesServiceStatus.OK) {
                results.forEach(function (place) {
                    // Calculate distance between current location and EV station
                    var distance = google.maps.geometry.spherical.computeDistanceBetween(
                        new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
                        place.geometry.location
                    );

                    // Add a marker for each EV station found
                    var marker = new google.maps.Marker({
                        map: map,
                        position: place.geometry.location,
                        title: place.name
                    });

                    // Add click event listener to the marker
                    marker.addListener('click', function () {
                        handleMarkerClick(marker, place);
                    });

                    // Calculate distance in kilometers and round to 2 decimal places
                    var distanceInKm = (distance / 1000).toFixed(2);

                    // Create list item with station details and distance
                    var listItem = document.createElement('li');
                    listItem.innerHTML = `
                    <h3>${place.name}</h3>
                    <p>${place.vicinity}</p>
                    <p>Distance: ${distanceInKm} km</p>
                `;
                    document.getElementById('stationList').appendChild(listItem);

                    markers.push(marker); // Add marker to the array
                });
            }
        });
    });
}

navigateButton.addEventListener('click', function () {
    calculateAndDisplayRoute();
});

function displayNearbyEVStations() {
    // Retrieve selected radius value from the range input
    var radius = document.getElementById('radiusRange').value;

    // Retrieve current location
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // Perform nearby search for EV stations with the updated radius
            var request = {
                location: currentLocation,
                radius: parseInt(radius), // Convert radius to integer
                keyword: 'ev station'
            };

            var service = new google.maps.places.PlacesService(map);
            service.nearbySearch(request, function (results, status) {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    results.forEach(function (place) {
                        // Calculate distance between current location and EV station
                        var distance = google.maps.geometry.spherical.computeDistanceBetween(
                            new google.maps.LatLng(currentLocation.lat, currentLocation.lng),
                            place.geometry.location
                        );

                        // Calculate distance in kilometers and round to 2 decimal places
                        var distanceInKm = (distance / 1000).toFixed(2);

                        // Add a marker for each EV station found
                        var marker = new google.maps.Marker({
                            map: map,
                            position: place.geometry.location,
                            title: place.name
                        });

                        // Add click event listener to the marker
                        marker.addListener('click', function () {
                            handleMarkerClick(marker, place, distanceInKm);
                        });

                        // Push the marker JSON to the markers array
                        markers.push(marker);
                    });
                }
            });
        });
    }
}

function handleMarkerClick(marker, place, distanceInKm) {
    // Store details of the clicked marker in sessionStorage
    var markerDetails = {
        name: place.name,
        address: place.vicinity,
        distance: distanceInKm
    };
    sessionStorage.setItem('clickedMarker', JSON.stringify(markerDetails));

    // Redirect to list.html
    window.location.href = 'list.html';
}

document.getElementById('EVStationsList').addEventListener('click', async function () {
    // sessionStorage.setItem('markers', JSON.stringify(markers));
    console.log(markers);
    
    // Redirect to list.html
    // window.location.href = 'list.html';
})