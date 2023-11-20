/*

Gebruik:

Maak een image aan met een pijl die naar boven wijst.
Op computer zal kompas altijd het noorden aanwijzen, dus rekeninghoudend met een normale kaart-oriëntatie.
Op telefoon zal deze rekening houden met het kompas van de telefoon zelf.

Je zal ook een bericht moeten verzien dat je kan tonen/verbergen om permissies op te vragen. Dit gaat enkel nodig zijn voor iOS,
dus dat bericht moet by default verborgen zijn. (vandaag dat het voorbeeld al meteen onHideRequestPermissions() oproept ook)

Eerste argument: lat van gps
Tweede argument: lon van gps
Derde argument: lat van gewenste locatie
Vierde argument: lon van gewenste locatie
Vijfde argument: selector voor de image van de pijl
Zesde argument: selector voor de button om permissie te geven
Zevende argument: de onShow functie voor de permissies
Achtste argument: de onHide functie voor de permissies


//
// .html
//

// head:

<script defer src="../../scripts/get-distance.js"></script>
<script defer src="../../plugins/point-to-location.js"></script>

// body:

<img src="path/to/arrow.svg" alt="volg mij" id="point-to-location"/>
<div id="request-permissions">
  Mogen we je kompas gebruiken om je naar de juiste locatie te gidsen?
  <button id="request-permissions-button">Geef goedkeuring</button>
</div>

//
// .js
//

const requestPermissionsElement = document.querySelector('#request-permissions')
function onShowRequestPermissions() {
  requestPermissionsElement.style.display = 'block';
}

function onHideRequestPermissions() {
  requestPermissionsElement.style.display = 'none';
}
onHideRequestPermissions();

function success(postion) {
  pointToLocation(position.coords.latitude, position.coords.longitude, coordinates.latitude, coordinates.longitude, '#point-to-location', '#request-permissions-button', onShowRequestPermissions, onHideRequestPermissions);
}

...

navigator.geolocation.watchPosition(success, error, options);

*/

/* Source: https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi */

const isIOS = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
let compassStarted = false;
let compassStartedViaClick = false;
let compass = null;
let direction = null;
let pointerElement = null;
let requestPermissionsButtonElement = null;
let showRequestPermissions = null;
let hideRequestPermissions = null;

function startCompass() {
  if (!compassStarted) {
    compassStarted = true;
    if (!isIOS) {
      window.addEventListener("deviceorientationabsolute", handler, true);
    } else {
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === "granted") {
            window.addEventListener("deviceorientation", handler, true);
          } else {
            alert("Zonder kompas wordt het lastig. Richtingaanwijzing via het noorden.");
          }
        })
        .catch(() => {
          if (compassStartedViaClick) {
            alert("Kompas niet beschikbaar. Richtingaanwijzing via het noorden.")
          } else {
            showRequestPermissions();
            requestPermissionsButtonElement.onclick = () => {
              compassStartedViaClick = true;
              compassStarted = false;
              hideRequestPermissions();
              startCompass();
            }
          }
        });
    }
  }
}

function handler(e) {
  compass = e.webkitCompassHeading || Math.abs(e.alpha - 360);
  compass = -compass;
  onChange();
}

function onChange() {
  if (pointerElement !== null) {
    if (direction === null) {
      pointerElement.style.visibility = 'hidden';
    } else {
      pointerElement.style.visibility = 'visible';
      if (compass === null) {
        pointerElement.style.transform = `rotate(${direction}deg)`;
      } else {
        pointerElement.style.transform = `rotate(${compass + direction}deg)`;
      }
    }
  }
}

function pointToLocation(lat1, lon1, lat2, lon2, pointerSelector, requestPermissionsButtonSelector, onShowRequestPermissions, onHideRequestPermissions) {
  showRequestPermissions = onShowRequestPermissions;
  hideRequestPermissions = onHideRequestPermissions;

  requestPermissionsButtonElement = document.querySelector(requestPermissionsButtonSelector);
  pointerElement = document.querySelector(pointerSelector);

  direction = getDistance(lat1, lon1, lat2, lon2).directionInDegrees;

  startCompass();
  onChange();
}
