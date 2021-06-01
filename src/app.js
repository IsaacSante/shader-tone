import {PerspectiveCamera, Scene, WebGLRenderer, Color, } from "three";
import {GrainPlayer, Meter } from "tone"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculpture, } from 'shader-park-core';
// import { spCode2 } from './spCode2.js';
const song = require('./audio/lose.mp3');

console.log('Hey this Isaac')

let spCode = `
let soundTime = input()
let amp = input()
let scale = input()
setMaxIterations(3);
setStepSize(.9999)
let s = getRayDirection();
let n = amp*noise(scale*s+soundTime*.1)+0.3;
shine(abs(n)*2);
color(normal*.9 + abs(sin(soundTime/10)) + vec3(n));
sphere(0.5 + n);
`

// import SerialPort from "serialport";
// get Arduino stuff
// process.setMaxListeners(0);
// var portName = "COM3"; // Change to your port name
// var myPort = new SerialPort(portName, 9600);
// let Readline = SerialPort.parsers.Readline; // make instance of Readline parser
// let parser = new Readline(); // make a new parser to read ASCII lines
// myPort.pipe(parser); // pipe the serial stream to the parser
// myPort.on('open', showPortOpen); // called when the serial port opens
// myPort.on('close', showPortClose); // called when the serial port closes
// myPort.on('error', showError); // called when there's an error with the serial port
// parser.on('data', readSerialData); // called when there's new data incoming
// function readSerialData(data) {
//     console.log(data)
// }
// function showPortOpen() {
//     console.log('port open. Data rate: ' + myPort.baudRate);
// }
// function showPortClose() {
//     console.log('port closed.');
// }
// function showError(error) {
//     console.log('Serial port error: ' + error);
// }
//

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
let params = {soundTime: 0, amp: 1, scale: 1.6};
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



let mesh = createSculpture(spCode, () => ( {
  soundTime: params.soundTime,
  amp: params.amp,
  scale: params.scale,
} ));
scene.add(mesh);

let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5,
} );

let newSongSpeed
let conditionHandler;

function songSpeed() {
conditionHandler = Math.abs(analyser.getValue())
    if( 60 > conditionHandler > 0 ) {
      newSongSpeed = Math.abs(Math.cos(analyser.getValue()));
    }else{
      newSongSpeed = 0; 
    }
}

let render = () => {
  requestAnimationFrame( render );
  controls.update();
  renderer.render( scene, camera );
  
        if(player){

        params.amp = scale(slider1,-40,-12,0,1);
        params.scale = scale(slider2,0,200,0,3);
        player.volume.value = slider1
        player.detune = slider2

        if (player.state === "started") {
          songSpeed()
          params.soundTime += .001
          params.soundTime =  params.soundTime + (newSongSpeed/2) 
        }else{
          params.soundTime += .001
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