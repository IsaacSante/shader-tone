export function spCode2() {
//   mirrorXYZ();
//   displace(abs(cos(time)), 0.0, 0.0);
//   let size = 0.3
// let hue = abs(sin(time*.2));
let soundTime = input() 
let saturation = 1;
let value = 1;
// let col = hsv2rgb(vec3(hue, saturation, value));
// color(col)
let amp = 1;
let scale = 1.6;
setMaxIterations(3);
setStepSize(.9999)
let s = getRayDirection();
let n = amp*noise(scale*s+soundTime*.1)+0.3;
shine(abs(n)*2);
color(normal*.9 + abs(sin(soundTime/10)) + vec3(n, n, n));
sphere(0.5 + n);
  }