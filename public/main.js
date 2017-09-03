const run = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const analyser = audioCtx.createAnalyser();

  const audioEl = new Audio();
  audioEl.crossOrigin = 'anonymous';
  audioEl.src = 'assets/functions.mp3';
  audioEl.controls = true;
  audioEl.autoplay = true;

  const sound = audioCtx.createMediaElementSource(audioEl);
  sound.connect(analyser);

  document.querySelector('body').append(audioEl);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  const canvas = document.getElementById("canvas");
  const canvasCtx = canvas.getContext("2d");

  function draw() {

    drawVisual = requestAnimationFrame(draw);

    analyser.getByteTimeDomainData(dataArray);

    canvasCtx.fillStyle = 'rgb(200, 200, 200)';
    canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const sliceWidth = canvas.width * 1.0 / bufferLength;
    let x = 0;

    for (var i = 0; i < bufferLength; i++) {

      let v = dataArray[i] / 128.0;
      let y = v * canvas.height / 2;

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
}


document.addEventListener('DOMContentLoaded', run);
