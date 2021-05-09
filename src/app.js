import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Color,
} from "three";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { createSculpture, createSculptureWithGeometry } from 'shader-park-core';
import { spCode } from './spCode.js';
import { spCode2 } from './spCode2.js';

import * as Tone from 'tone'
const song = require('./audio/Stronger.mp3');

let scene = new Scene();
let params = { time: 0 , ShineAmount: 0};
let player, autoFilter, analyser;

let camera = new PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );
camera.position.z = 4;

let container = document.getElementById( 'canvas' );
document.body.appendChild( container );

let renderer = new WebGLRenderer({ antialias: true, alpha: true  });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor( new Color(1, 1, 1), 1 );
container.appendChild( renderer.domElement );
renderer.setClearColor( 0x000000, 0 );


let setUp =  async () => {
  player = new Tone.Player();
      player.loop = true;
      player.autostart = false;
      player.loopStart = 1.0;
    
      // Load and "await" the MP3 file
      await player.load(song);
  
      autoFilter = new Tone.AutoFilter("8n");
      autoFilter.start();
      player.connect(autoFilter);
      analyser = new Tone.Analyser('waveform', 128);
      autoFilter.connect(analyser);
      player.toDestination()

}

//Shader Park setup
let mesh = createSculpture(spCode, () => ( {
  time: params.time,
  ShineAmount: params.ShineAmount,
  size: 12,
  gyroidSteps: .03
} ));

scene.add(mesh);

let controls = new OrbitControls( camera, renderer.domElement, {
  enableDamping : true,
  dampingFactor : 0.25,
  zoomSpeed : 0.5,
  rotateSpeed : 0.5
} );

let render = () => {
  // if (!player || !player.loaded ) {
  //   // MP3 not loaded
  //   return;
  // }
  requestAnimationFrame( render );
  params.time += 0.01;
  params.ShineAmount += 0.01;
  controls.update();
  renderer.render( scene, camera );
};

function checkSong() {
  console.log('TRUE')
      if (player && player.loaded) {
      if (player.state === "started") {
              player.stop();
      } else {
              player.start();
      }
  }
}

var buttons = document.getElementsByTagName("button");
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener("click", onButtonClick, false);
};

function onButtonClick(event) {
  // alert(event.target.id);
  if (player && player.loaded) {
    if (player.state === "started") {
            player.stop();
    } else {
            player.start();
    }
}
}

// function onDocumentMouseDown( event ) {
//   event.preventDefault();
//   checkSong() 
// }
// container.addEventListener('click', function (event) {
//     alert('Hi!');
// });




setUp()
render();

// import {sculptToMinimalRenderer} from shaderparkcore
// import {spCode} from './spCode.js';


// import * as shader from shader



// import p5 from 'p5'
// import * as Tone from 'tone'
// const song = require('./audio/Stronger.mp3');

// import {spCode} from './spCode.js';
// import {Sculpture} from './Sculpture.js';
// import * as THREE from 'three'; //REMOVE this in production

// const DEBUG = true; // Set to false in production

// if(DEBUG) {
//     window.THREE = THREE;
// }

// let container, scene, camera, renderer;
// let time, clock;

// function init(){

//   container = document.getElementById("container");
//   scene = new Scene();
//   scene.background = new Color("skyblue");
//   clock = new Clock(true);
//   time = 0;

//   createCamera();
//   createLights();
//   createRenderer();
//   createGeo()

// //   renderer.setAnimationLoop(() => {
// //     update();
// //     renderer.render(scene, camera);
// // });

// }


// function createCamera() {
//   const aspect = container.clientWidth / container.clientHeight;
//   camera = new PerspectiveCamera(35, aspect, 0.1, 1000);
//   camera.position.set(100, 50, 200);

// }

// function createLights() {
//   const directionalLight = new DirectionalLight(0xffffff, 5);
//   directionalLight.position.set(5, 5, 10);
//   const hemisphereLight = new HemisphereLight(0xddeeff, 0x202020, 3);
//   scene.add(directionalLight, hemisphereLight);
// }

// function createRenderer() {
//   renderer = new WebGLRenderer({ antialias: true });
//   renderer.setSize(container.clientWidth, container.clientHeight);
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.physicallyCorrectLights = true;
//   container.appendChild(renderer.domElement);
// }

// function createGeo()  {

//   // let sculpture = new Sculpture(spCode);
//   //  scene.add(sculpture.mesh);

//   // sculpture = new Sculpture('sphere(0.2);');

//     let sculpMesh = sculptToThreeJSMesh('sphere(0.5);');
//     // // console.log(mesh);
//     let uniformDescriptions = sculpMesh.material.uniformDescriptions;
//     let matUniforms = sculpMesh.material.uniforms;

//     let defaultUniforms = { 'sculptureCenter': 0, 'opacity': 0, 'time': 0, 'stepSize': 0, 'mouse': 0};
//     let customUniforms = uniformDescriptions.filter(uniform => !(uniform.name in defaultUniforms));
    
//     // //set the default value of the uniforms
//     // customUniforms.forEach(uniform => matUniforms[uniform.name].value = uniform.value);

//     // // default uniforms for the scupture
//     // matUniforms['sculptureCenter'].value = new Vector3();
//     // matUniforms['mouse'].value = new Vector3();
//     // matUniforms['opacity'].value = 1.0;
//     // matUniforms['time'].value = 0.0;
//     // matUniforms['stepSize'].value = 0.85;
    
//     // // console.log(sculpture);
//     scene.add(sculpture.mesh);


// }

// function animate(){
//   requestAnimationFrame(animate);
//    renderer.render(scene, camera)
//   }
 



// init()
// animate()

// const s = p => {
//     let canvas, player, autoFilter, analyser, slider, slider1; 
//     let playing = false;

//     p.setup = async function() {
//      canvas =  p.createCanvas(window.innerWidth, 400, p.WEBGL);
//      slider = document.getElementById("slider");
//      slider1 = document.getElementById("slider1");
//      canvas.mousePressed(checkSong);
//      p.noStroke()

//       player = new Tone.Player();
//       player.loop = true;
//       player.autostart = false;
//       player.loopStart = 1.0;
    
//       // Load and "await" the MP3 file
//       await player.load(song);
  
//       autoFilter = new Tone.AutoFilter("8n");
//       autoFilter.start();
//       player.connect(autoFilter);
//       analyser = new Tone.Analyser('waveform', 128);
//       autoFilter.connect(analyser);
//       autoFilter.toDestination()
//     };
  
//     p.draw = function() {
//         if (!player || !player.loaded ) {
//             // MP3 not loaded
//             return;
//           }
//         //   console.log(Tone.toDestination.volume.value)
//           autoFilter.wet.value = slider.value;
//           autoFilter.frequency.value = slider1.value;

//       p.background(0);
//       p.stroke(0);
//     //   p.fill(255,0,0);
//     //   p.ellipse(0, canvas.height/2, 200);
//     //   p.ellipse(canvas.width, canvas.height/2, 200);
//         // Draw waveform if playing  
//   if (player.state === "started") {
//     const values = analyser.getValue();

//     p.beginShape();
//     for (let i = 0; i < values.length; i++) {
//       const amplitude = values[i];
//       const x = p.map(i, 0, values.length - 1, 0, canvas.width/3);
//       const y = canvas.height / 2 + amplitude * canvas.height/4;
//       // Place vertex
//       p.vertex(x, y);
//     }
//     p.endShape();
//   }

     


//     };

//     const checkSong = function() {
//     if (player && player.loaded) {
//           if (player.state === "started") {
//             player.stop();
//           } else {
//             player.start();
//           }
//         }
//     }

//   };
  
//   new p5(s);
