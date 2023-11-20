// iframe

const iframeElement = document.querySelector('#iframe');
iframeElement.src = getNextPage();

// simulator

function drawCoordinatesAsText(coordinates) {
  const coordinatesElement = document.querySelector('#coordinates');
  coordinatesElement.textContent = `lat: ${coordinates.lat}, lng: ${coordinates.lng}`;
}

mapboxgl.accessToken = mapboxAccessToken;

const startCoordinates = {
  lat: 51.219608,
  lng: 4.411694
};

drawCoordinatesAsText(startCoordinates);

const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [startCoordinates.lng, startCoordinates.lat],
  zoom: 15
});

const marker = new mapboxgl.Marker({
  draggable: true
})
.setLngLat([startCoordinates.lng, startCoordinates.lat])
.addTo(map);

let markerCoordinates = startCoordinates;

function onDragEnd() {
  markerCoordinates = marker.getLngLat();
  iframeElement.contentWindow.postMessage(markerCoordinates, "*");
  drawCoordinatesAsText(markerCoordinates);
}

marker.on('dragend', onDragEnd);

// listen to messages from iframe

function handleMessage (evt) {
  if (evt.data.message === 'navigate-init') {
    iframeElement.contentWindow.postMessage(markerCoordinates, "*");
  }
  if (evt.data.message === 'navigate-localstorage') {
    localStorage.setItem('coordinates', evt.data.coordinates);
    localStorage.setItem('locationName', evt.data.locationName);
    localStorage.setItem('nextPage', evt.data.nextPage);
  }
}
window.addEventListener("message", handleMessage, false);
