const THREE = require('three')

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const run = () => {

  /* =====================================
    AUDIO CONTEXT
  ======================================== */


  const analyser = audioCtx.createAnalyser();

  // const audioEl = new Audio();
  // audioEl.src = 'assets/functions.mp3';
  // audioEl.autoplay = true;
  //
  // const sound = audioCtx.createMediaElementSource(audioEl);
  // sound.connect(analyser);

  // document.querySelector('body').append(audioEl);

  const source = audioCtx.createBufferSource();
  const request = new XMLHttpRequest();

  request.open('GET', 'assets/functions.mp3', true);

  request.responseType = 'arraybuffer';

  request.onload = function() {
    const audioData = request.response;

    audioCtx.decodeAudioData(audioData, function(buffer) {
        source.buffer = buffer;

        source.connect(analyser);
        source.loop = true;
        source.start(0);
      },

      function(e){ console.log("Error with decoding audio data" + e.err); });
  }

  request.send();

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

  const biquadFilter = audioCtx.createBiquadFilter();
  analyser.connect(audioCtx.destination);


  /* =====================================
     VIDEO
  ======================================== */


  const videoEl = document.createElement("VIDEO");
  videoEl.src = 'assets/RHex.mp4';
  videoEl.autoplay = true;
  videoEl.muted = true;
  videoEl.loop = true;

  /* =====================================
    THREE JS
  ======================================== */

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
  const light1 = new THREE.AmbientLight(0xffffff, 0.1)
  const light2 = new THREE.PointLight(0xffffff, .8, 100)
  light2.position.set( 0, 0, 10 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const geometry = new THREE.BoxGeometry( 1, 0.1, 0.1 );
  const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
  const cube = new THREE.Mesh( geometry, material );
  const cube2 = new THREE.Mesh( geometry, material );
  const cube3 = new THREE.Mesh( geometry, material );
  const cube4 = new THREE.Mesh( geometry, material );
  const cube5 = new THREE.Mesh( geometry, material );
  const cube6 = new THREE.Mesh( geometry, material );
  const cube7 = new THREE.Mesh( geometry, material );
  cube.position.x = -3;
  cube2.position.x = -2;
  cube3.position.x = -1;
  cube4.position.x = 0;
  cube5.position.x = 1;
  cube6.position.x = 2;
  cube7.position.x = 3;

  scene.add( cube, cube2, cube3, cube4, cube5, cube6, cube7, light1, light2 );

  camera.position.z = 5;


  const vidTexture = new THREE.VideoTexture( videoEl );
  vidTexture.minFilter = THREE.LinearFilter;
  vidTexture.magFilter = THREE.LinearFilter;
  vidTexture.format = THREE.RGBFormat;

  const videoMatt = new THREE.MeshPhongMaterial({
    map: vidTexture
  });

  const loader = new THREE.JSONLoader();

  loader.load('assets/weed2.json', (geometry) => {
    const weed = new THREE.Mesh( geometry, videoMatt );
    weed.position.z = -6;
    weed.position.y = 1;
    weed.rotation.x = 1;
    weed.name = "weed"
    scene.add( weed );
  });

  /* =====================================
    RAYCASTER
  ======================================== */

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  const onClick = (event) => {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  }



  /* =====================================
    ANIMATE
  ======================================== */

  const animate = function () {
    requestAnimationFrame( animate );

    analyser.getByteTimeDomainData(dataArray);

    light2.intensity = dataArray[0] / 128.0 / 2;
    cube.position.y = dataArray[0] / 64.0 - 4;
    cube.position.z = dataArray[0] / 64.0 - 2;
    cube2.position.y = dataArray[100] / 64.0 - 4;
    cube2.position.z = dataArray[0] / 64.0 - 2;
    cube3.position.y = dataArray[200] / 64.0 - 4;
    cube3.position.z = dataArray[0] / 64.0 - 2;
    cube4.position.y = dataArray[300] / 64.0 - 4;
    cube4.position.z = dataArray[0] / 64.0 - 2;
    cube5.position.y = dataArray[400] / 64.0 - 4;
    cube5.position.z = dataArray[0] / 64.0 - 2;
    cube6.position.y = dataArray[500] / 64.0 - 4;
    cube6.position.z = dataArray[0] / 64.0 - 2;
    cube7.position.y = dataArray[600] / 64.0 - 4;
    cube7.position.z = dataArray[0] / 64.0 - 2;


    raycaster.setFromCamera( mouse, camera );

    const intersects = raycaster.intersectObjects( scene.children );

    for ( let i = 0; i < intersects.length; i++ ) {
        if (intersects[ i ].object.name != 'weed') {
          intersects[ i ].object.material.color.set( 0xff0000 );
        }
    }

    renderer.render(scene, camera);
  };

  window.addEventListener( 'click', onClick, false );
  animate();
}


document.addEventListener('DOMContentLoaded', run);
