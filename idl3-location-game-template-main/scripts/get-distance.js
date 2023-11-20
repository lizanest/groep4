// Degrees to Radians
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Redians to Degrees
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}

// Calculate Distance Between LatLongs
function getDistance(lat1, lon1, lat2, lon2) {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);

  const lat1rad = degreesToRadians(lat1);
  const lat2rad = degreesToRadians(lat2);
  const lon1rad = degreesToRadians(lon1);
  const lon2rad = degreesToRadians(lon2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
          + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1rad) * Math.cos(lat2rad);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = Math.round((earthRadiusKm * c) * 1000);

  const y = Math.sin(lon2rad - lon1rad) * Math.cos(lat2rad);
  const x = Math.cos(lat1rad) * Math.sin(lat2rad)
        - Math.sin(lat1rad) * Math.cos(lat2rad) * Math.cos(lon2rad - lon1rad);
  let brng = Math.atan2(y, x);
  brng = radiansToDegrees(brng);

  const direction = Math.round((brng + 360) % 360);

  return {
    distance,
    directionInDegrees: direction,
    directionInWind: convertWindDirection(direction),
  };
}

// Convert Bearing
function convertWindDirection(direction) {
  let result = '';
  if (direction < 22.5) {
    result = 'N';
  } else if (direction > 22.5 && direction < 67.5) {
    result = 'NE';
  } else if (direction > 67.5 && direction < 112.5) {
    result = 'E';
  } else if (direction > 112.5 && direction < 157.5) {
    result = 'SE';
  } else if (direction > 157.5 && direction < 202.5) {
    result = 'S';
  } else if (direction > 202.5 && direction < 247.5) {
    result = 'SW';
  } else if (direction > 247.5 && direction < 292.5) {
    result = 'W';
  } else if (direction > 292.5 && direction < 337.5) {
    result = 'NW';
  } else if (direction > 337.5) {
    result = 'N';
  }

  return result;
}
