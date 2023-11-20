/*

Gebruik:

De video tag dient om je beeld te laten zien. Als je een foto wil laten
nemen heb je de capture button nodig en een canvas element.
In het canvas element wordt de genomen foto weergegeven.

Om alles op te starten gebruik je de startCamera functie met:
Eerste argument: true voor front camera, false voor back camera (boolean, required)
Tweede argument: selector voor het video element (string, required)
Derde argument: selector voor het canvas element (string, optioneel)
Vierde argument: selector voor het button element (string, optioneel)
Vijfde argument: een functie die wordt aangeroepen als er een foto genomen is (function, optioneel)


//
// .html
//

// head:

<script defer src="../../plugins/camera.js"></script>

// body:

<video id="video" width="320" height="240" autoplay playsinline></video>
<button id="capture">Capture</button>
<canvas id="canvas"></canvas>

//
// .js
//

function callback(base64) {
  console.log('the image was captured');
  console.log(base64);
}

startCamera(false, '#video', '#canvas', '#capture', callback);

*/

async function startCamera(useFrontCamera, videoSelector, canvasSelector, captureSelector, onClickFunction) {
  let videoElement = document.querySelector(videoSelector);
  let canvasElement = document.querySelector(canvasSelector);
  let captureButton = document.querySelector(captureSelector);

  if (!videoElement) console.error('Video selector could not find a valid element');

  let videoConfiguration = { facingMode: { exact: "environment" } };
  if (useFrontCamera) videoConfiguration = { facingMode: "user" };

  try {
    let stream = await navigator.mediaDevices.getUserMedia({ video: videoConfiguration, audio: false });
    videoElement.srcObject = stream;

    if (captureButton && canvasElement) {
      captureButton.onclick = () => {
        canvasElement.width = videoElement.videoWidth;
        canvasElement.height = videoElement.videoHeight;
        canvasElement.getContext('2d').drawImage(videoElement, 0, 0);
        let imageBase64 = canvasElement.toDataURL('image/jpeg');

        if (onClickFunction) onClickFunction(imageBase64);
      };
    }
  } catch(e) {
    alert(e);
  }
};
