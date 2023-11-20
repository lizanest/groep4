/*
Gebruik:

Importeer eerst hetvolgende in de head van je html:

<link href="https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.css" rel="stylesheet">
<script src="https://api.mapbox.com/mapbox-gl-js/v2.4.1/mapbox-gl.js"></script>
<script defer src="../../scripts/secrets.js"></script>
<script defer src="../../plugins/maps.js"></script>

Vergeet niet om de scripts/secrets.example.js om te vormen naar scrips/secrets.js met daarin de juiste mapbox public api key.

Met createMap kan je een interactieve map tonen.
Hiervoor heb je een element nodig met een unieke ID waar we deze map op kunnen toepassen.
Dit element heeft ook afmetingen nodig om getoond te kunnen worden.

Dit oproepen doe je als volgt:

const myMap = createMap("uniekeID", latitude, longitude, zoom, 'mapbox://styles/...');

- 'myMap' moet eveneens een unieke waarde zijn
- latitude en longitude zijn de coördinaten
- 'zoom' moet een getal van 0-22 zijn
- De laatste parameter dient om je map een unieke styling mee te geven
- Deze kan je bij mapox zelf aanmaken en er wordt je dan de nodige link hiervoor gegeven.
  Deze parameter is optioneel


Nadat je één of meerdere maps hebt aangemaakt, kan je hierop ook custom markers aanbrengen.
Je hebt de unieke 'myMap' nodig om te zeggen op welke map er een pin moet komen.

Een pin aanmaken doe je zo:

createMarker(myMap, 'markerID', width, height, "path/to/pin.svg",latitude,longitude, false);

- Eerste parameter is de map waarop we de pin gaan plaatsen.
- Dan volgt de unieke id van je marker
- width/height: Hoe breed en hoog is je marker? Telkens een cijfer zonder pixels
- Je marker: kan een png of svg zijn (jpg ook maar die heeft geen transparantie)
- latitude en longitude zijn de coördinaten
- verplaatsbare marker? false/true zijn de enigste mogelijkheden
  default waarde is false (mag in dat geval dus weggelaten worden)

*/
function createMap(myID, lat, lng, zoom, styled) {
    lat = typeof lat !== "undefined" ? lat : 51.219608;
    lng = typeof lng !== "undefined" ? lng : 4.411694;
    zoom = typeof zoom !== "undefined" ? zoom : 15;
    styled = typeof styled !== "undefined" ? styled : "mapbox://styles/mapbox/streets-v11";

    mapboxgl.accessToken = mapboxAccessToken;

    const startCoordinates = {
      lat: lat,
      lng: lng,
    };

    const map = new mapboxgl.Map({
      container: myID,
      style: styled,
      center: [startCoordinates.lng, startCoordinates.lat],
      zoom: zoom
    });

    return map;
  }
  function createMarker(map, className, myWidth, myHeight, image, lat, lng, draggable) {
    draggable = typeof draggable !== "undefined" ? draggable : false;
    const el = document.createElement("div");
    el.className = className;
    el.style.backgroundImage = `url(`+image+`)`;
    el.style.width = `${myWidth}px`;
    el.style.height = `${myHeight}px`;
    el.style.backgroundSize = "100%";

    const marker = new mapboxgl.Marker(el, {
      draggable: draggable
    }).setLngLat([lng,lat]).addTo(map);

    return marker;
  }
