/*

Gebruik:

De video tag dient om je beeld te laten zien. Als je een foto wil laten
nemen heb je de capture button nodig en een canvas element.
In het canvas element wordt de effectief genomen foto weergegeven.

Om de microfoon op te starten gebruik je de getMicrophone functie met:
Eerste argument: een callback functie waarin je telkens het volume van de microfoon zal terugkrijgen.


//
// .html
//

// head:

<script defer src="../../plugins/microphone.js"></script>

//
// .js
//

function microphoneSuccess(volume) {
  console.log(volume); 
}

getMicrophone(microphoneSuccess);

*/


async function getMicrophone(callback) {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false })

  audioContext = new AudioContext();
  analyser = audioContext.createAnalyser();
  microphone = audioContext.createMediaStreamSource(stream);
  javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

  analyser.smoothingTimeConstant = 0.8;
  analyser.fftSize = 1024;

  microphone.connect(analyser);
  analyser.connect(javascriptNode);
  javascriptNode.connect(audioContext.destination);
  javascriptNode.onaudioprocess = function() {
    let array = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(array);
    let values = 0;

    let length = array.length;
    for (let i = 0; i < length; i++) {
      values += (array[i]);
    }

    let average = values / length;

    if (callback) callback(average);
  }
}
