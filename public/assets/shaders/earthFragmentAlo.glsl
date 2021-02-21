uniform float time;
uniform sampler2D aTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 eyeVector;

float fresnel(vec3 eyeVector , vec3 worldNormal){

    return pow(1.0 + dot(eyeVector,worldNormal) , 1.5);

}

void main() {

    float f = fresnel(eyeVector,vNormal) * 2.;
    vec4 alo = vec4(vec3(f),1.);
    vec4 color =  vec4(0.,0.5,1.,1.);

    gl_FragColor =  alo * color;
    gl_FragColor.a = alo.r;

}
