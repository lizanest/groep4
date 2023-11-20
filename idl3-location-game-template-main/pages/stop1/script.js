const continueButton = document.querySelector('#continue-button');

continueButton.onclick = () => {
  const coordinates = '51.197837,4.463655'
  const locationName = 'Boekenbergpark';
  const nextPage = 'stop2';
  location.assign(`../navigate/index.html?coordinates=${coordinates}&locationName=${locationName}&nextPage=${nextPage}`)
}
