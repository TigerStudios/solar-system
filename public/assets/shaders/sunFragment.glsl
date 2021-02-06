uniform float time;

varying vec3 vPosition;

void main() {

    gl_FragColor = vec4(vPosition,1.);

}
