function getNextPage() {
  // haal laatste opgeslagen info op
  const nextPage = localStorage.getItem('nextPage');
  const coordinates = localStorage.getItem('coordinates');
  const locationName = localStorage.getItem('locationName');

  // zijn er opgeslagen gegevens gevonden?
  if (nextPage) {
    // ga naar de navigatie pagina, en geef de coordinaten, naam en successpagina mee
    // als we op die pagina komen moet kijkt hij waar de gebruiker is, is hij op de gezochte locatie,
    // dan veranderd de pagina vanzelf in de juiste pagina van die locatie
    return `./pages/navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`;
  }

  // als er niets gevonden is navigeren we naar de startpagina
  return './pages/start/index.html';
};
