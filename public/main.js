const THREE = require('three')

const run = () => {

  /* =====================================
    AUDIO CONTEXT
  ======================================== */

  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const analyser = audioCtx.createAnalyser();

  const audioEl = new Audio();
  audioEl.src = 'assets/functions.mp3';
  audioEl.autoplay = true;

  const sound = audioCtx.createMediaElementSource(audioEl);
  sound.connect(analyser);

  document.querySelector('body').append(audioEl);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 2048;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);
  analyser.getByteTimeDomainData(dataArray);

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

  const geometry = new THREE.BoxGeometry( 1, 0.1, 1 );
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
    weed.position.z = -8;
    weed.rotation.x = 1;
    scene.add( weed );
  });

  // const vidGeo = new THREE.BoxGeometry(10, 5, .1);
  // const vidCube = new THREE.Mesh(vidGeo, videoMatt);
  // vidCube.position.z = -5;
  // vidCube.position.x = 5;
  // vidCube.rotation.y = -0.5;
  // scene.add( vidCube );

  // const textureLoader = new THREE.TextureLoader();
  //
  // textureLoader.load('assets/aqua.jpg', (texture) => {
  //   const aquaGeo = new THREE.BoxGeometry(10, 5, .1);
  //   const aqua = new THREE.MeshPhongMaterial({
  //     map: texture
  //   });
  //   const auqaCube = new THREE.Mesh(aquaGeo, aqua);
  //   auqaCube.position.z = -5;
  //   auqaCube.position.x = -5;
  //   auqaCube.rotation.y = 0.5;
  //   scene.add( auqaCube );
  // })

  /* =====================================
    ANIMATE
  ======================================== */

  const animate = function () {
    requestAnimationFrame( animate );

    analyser.getByteTimeDomainData(dataArray);

    light2.intensity = dataArray[0] / 128.0 / 2;
    cube.position.y = dataArray[0] / 64.0 - 4;
    cube2.position.y = dataArray[100] / 64.0 - 4;
    cube3.position.y = dataArray[200] / 64.0 - 4;
    cube4.position.y = dataArray[300] / 64.0 - 4;
    cube5.position.y = dataArray[400] / 64.0 - 4;
    cube6.position.y = dataArray[500] / 64.0 - 4;
    cube7.position.y = dataArray[600] / 64.0 - 4;

    renderer.render(scene, camera);
  };

  animate();
}


document.addEventListener('DOMContentLoaded', run);
