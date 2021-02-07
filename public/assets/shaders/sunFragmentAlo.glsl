uniform float time;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

vec3 bToColor(float b){

    b *= 0.32;

    return (vec3(b,b*b,b*b*b*b) / 0.32) * 0.65;

}

void main() {

    gl_FragColor = vec4(vNormal.z,0.,0.,1.) * -1.;
    gl_FragColor.a = 0.0;

}
