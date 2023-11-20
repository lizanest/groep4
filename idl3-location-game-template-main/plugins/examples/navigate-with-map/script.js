// neem html elementen vast
const locationNameElement = document.querySelector('#location-name');
const distanceElement = document.querySelector('#distance');

// definieer radius waarbinnen doelen gevonden mogen worden
const successRadiusInMeter = 20;

// haal alle query parameters op
const coordinatesParam = getQueryParam('coordinates').split(',');
const coordinates = {
  latitude: parseFloat(coordinatesParam[0]),
  longitude: parseFloat(coordinatesParam[1]),
}

const locationName = getQueryParam('locationName');
locationNameElement.textContent = locationName;

const nextPage = getQueryParam('nextPage');

// sla gegevens op in localStorage om later de draad terug op te kunnen pikken
localStorage.setItem('coordinates', coordinatesParam);
localStorage.setItem('locationName', locationName);
localStorage.setItem('nextPage', nextPage);

// map laden
let map = null;
let markerEnd = null;
let markerGPS = null;

// deze functie wordt opgeroepen elke keer een nieuwe locatie doorkomt
function success(position) {
  if (map) {
    map.flyTo({
      center: [position.coords.longitude, position.coords.latitude]
    });
  } else {
    map = createMap("mapper", position.coords.latitude, position.coords.longitude, 15, 'mapbox://styles/mapbox/streets-v11');
    markerEnd = createMarker(map, 'markerEnd', 42, 42, 'https://vaw.be/cacher/pin-454.png',coordinates.latitude, coordinates.longitude, false);
  }

  if (markerGPS) {
    markerGPS.setLngLat([position.coords.longitude, position.coords.latitude]);
  } else {
    markerGPS = createMarker(map, 'markerGPS', 42, 42, 'https://vaw.be/cacher/gps-454.png',position.coords.latitude, position.coords.longitude, false);
  }

  // bereken afstand tussen mijn locatie en die van mijn doel
  const distance = getDistance(position.coords.latitude, position.coords.longitude, coordinates.latitude, coordinates.longitude).distance;
  // laat die afstand zien
  distanceElement.textContent = distance;

  // de afstand tussen mijn locatie en die van mijn doel is minder dan 20 meter, rekeninghoudend met de accuraatheid van gps?
  if (distance < successRadiusInMeter + Math.min(position.coords.accuracy/2, successRadiusInMeter)) {
    // navigeer naar de pagina die getoond moet worden als ik in 20 meter van locatie ben
    location.assign(`../${nextPage}/index.html`)
  }
}

// wanneer geen gps beschikbaar is
function error(err) {
  console.warn('ERROR(' + err.code + '): ' + err.message);
}

// check if page lives in the test iframe
if (isInIframe()) {

  // get map gps positions
  function handleMessage (evt) {
  	success({coords: {latitude: evt.data.lat, longitude: evt.data.lng, accuracy: 35}});
  }
  // listen to messages from test-iframe
  window.addEventListener("message", handleMessage, false);
  parent.postMessage({message: "navigate-init"}, "*");
  parent.postMessage({message: "navigate-localstorage", coordinates: coordinatesParam, locationName, nextPage}, "*");

} else {

  // options for geolocation
  const options = {
    enableHighAccuracy: true,
    timeout: 20000,
    maximumAge: 0
  };

  // access real gps data
  navigator.geolocation.watchPosition(success, error, options);
}
