const run = () => {
  var audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Create an empty three-second stereo buffer at the sample rate of the AudioContext
  var myArrayBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 3, audioCtx.sampleRate);

  // Fill the buffer with white noise;
  //just random values between -1.0 and 1.0
  for (var channel = 0; channel < myArrayBuffer.numberOfChannels; channel++) {
    // This gives us the actual ArrayBuffer that contains the data
    var nowBuffering = myArrayBuffer.getChannelData(channel);
    for (var i = 0; i < myArrayBuffer.length; i++) {
      // Math.random() is in [0; 1.0]
      // audio needs to be in [-1.0; 1.0]
      nowBuffering[i] = Math.random() * 2 - 1;
    }
  }

  var source = audioCtx.createBufferSource();

  source.buffer = myArrayBuffer;

  var analyser = audioCtx.createAnalyser();

  const audioEl = new Audio();
  audioEl.crossOrigin = 'anonymous';
  audioEl.src = 'assets/functions.mp3';
  audioEl.controls = true;
  audioEl.autoplay = true;

  const sound = audioCtx.createMediaElementSource(audioEl);
  sound.connect(analyser);

  document.querySelector('body').append(audioEl);
  // source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 2048;
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  // Get a canvas defined with ID "oscilloscope"
  var canvas = document.getElementById("canvas");
  var canvasCtx = canvas.getContext("2d");

  // draw an oscilloscope of the current audio source

  function draw() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    var sliceWidth = canvas.width * 1.0 / bufferLength;
    var x = 0;

    for (var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * canvas.height / 2;

      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }

      x += sliceWidth;
    }

    canvasCtx.lineTo(canvas.width, canvas.height / 2);
    canvasCtx.stroke();
  };

  draw();

  source.start();
}


document.addEventListener('DOMContentLoaded', run);
