uniform float time;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;



void main() {

    vec4 mvPoition = modelViewMatrix * vec4(position,1.);
    gl_Position = projectionMatrix * mvPoition;

    vUv = uv;
    vPosition = position;
    vNormal = normal;

}
