import {PerspectiveCamera, Scene, WebGLRenderer, Color } from "three";
import {GrainPlayer, Meter } from "tone"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculpture} from 'shader-park-core';
import { spCode2 } from './spCode2.js';
const song = require('./audio/summer.mp3');

//init three js scene 
let scene = new Scene();
let camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
let container = document.getElementById( 'canvas' );
let renderer = new WebGLRenderer({ antialias: true, alpha: true  });

//set init values
camera.position.z = 0.5;
document.body.appendChild( container );
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor( new Color(1, 1, 1), 1 );
container.appendChild( renderer.domElement );
renderer.setClearColor( 0x000000, 0 );

//init sp code params & tone objects
let params = { time: 0, soundTime: 0, amp: 1, scale: 1.6};
let player, analyser;

//website stuff 
let songVolumeSlider = document.getElementById("myRangeVolume");
let songPitchSlider = document.getElementById("myRangePitch");

//arduino stuff
let slider1, slider2;
let arduinoIsPresent = false 

//map function 
function scale (number, inMin, inMax, outMin, outMax) {
  return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

//handles values for sp code depending if arduino is connected or not
function siteVals(){
  if(!arduinoIsPresent){
    slider1 = songVolumeSlider.value
    slider2 = songPitchSlider.value
  }else if(arduinoIsPresent){
    //do arduino shit here 
  }
}
//setup tone js objects
let setUp =  async () => {
player = new GrainPlayer({
  url:song,
  loop:false,
  autostart:false,
  loopStart:1.0
})
      analyser = new Meter();
      player.connect(analyser)
      player.toDestination()
}

let mesh = createSculpture(spCode2, () => ( {
  time: params.time,
  soundTime: params.soundTime,
  amp: params.amp,
  scale: params.scale
} ));
scene.add(mesh);

let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5,
} );

let render = () => {
  requestAnimationFrame( render );
  params.time += 0.001;
  controls.update();
  renderer.render( scene, camera );
        if(player){
        params.amp = scale(slider1,-40,-12,0,1);
        params.scale = scale(slider2,0,200,0,3);
        player.volume.value = slider1
        player.detune = slider2
        if (player.state === "started") {
          let count = Math.abs(Math.sin(analyser.getValue())) 
          params.soundTime = count
        }else{
          params.soundTime = 0
        }
      }
};

function onButtonClick(event) {
    player.start()
}
function onButtonClickStop(event) {
  player.stop()
}

//event listeners
var button = document.getElementsByTagName("button")[0];
var buttonStop = document.getElementsByTagName("button")[1];
button.addEventListener("click", onButtonClick, false);
buttonStop.addEventListener("click", onButtonClickStop, false);
songVolumeSlider.addEventListener("input", siteVals);
songPitchSlider.addEventListener("input", siteVals);

siteVals()
setUp()
render()