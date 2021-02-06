uniform float time;

varying vec3 vPosition;

void main() {

    vec4 mvPoition = modelViewMatrix * vec4(position,1.);

    gl_Position = projectionMatrix * mvPoition;

    vPosition = position;

}
