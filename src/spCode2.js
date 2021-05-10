export function spCode2() {
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
}