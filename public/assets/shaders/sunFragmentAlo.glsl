uniform float time;
uniform sampler2D sGlow;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {

    gl_FragColor = texture2D(sGlow,vUv);

}
