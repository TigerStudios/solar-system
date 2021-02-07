uniform float time;
uniform samplerCube tCube;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 eyeVector;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

float sun(){

    float sum = 0.;

    sum += textureCube(tCube,vLayer0).r;
    sum += textureCube(tCube,vLayer1).r;
    sum += textureCube(tCube,vLayer2).r;

    return sum;

}

vec3 bToColor(float b){

    b *= 0.27;

    return (vec3(b,b*b,b*b*b*b) / 0.27) * 0.8;

}

float fresnel(vec3 eyeVector , vec3 worldNormal){

    return pow(1.0 + dot(eyeVector,worldNormal) , 2.);

}

void main() {

    float b = sun() * 1.5 + 1.4;
    float f = fresnel(eyeVector,vNormal);

    b = b + f;

    vec3 color = bToColor(b);
    gl_FragColor = vec4(color,1.);

}
