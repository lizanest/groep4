// check of de game al dan niet in een iframe leeft
function isInIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}
