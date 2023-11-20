// de tijd van de timeout kan je aanpassen als je een fake loader langer of korten wil laten zien
setTimeout(() => {
  // ga naar de correcte pagina
  location.assign(getNextPage());
}, 1000);
