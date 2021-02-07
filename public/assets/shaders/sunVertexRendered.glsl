uniform float time;
uniform samplerCube tCube;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 eyeVector;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

mat2 r(float a){

    float c = cos(a);
    float s = sin(a);

    return mat2(c,-s,s,c);

}

void main() {

    vec4 mvPoition = modelViewMatrix * vec4(position,1.);

    gl_Position = projectionMatrix * mvPoition;
    eyeVector = normalize(position.xyz - cameraPosition);

    vUv = uv;
    vPosition = position;
    vNormal = normal;

    float t0 = time * 0.001;
    float t1 = time * 0.002;
    float t2 = time * 0.003;

    vec3 pos0 = position;
    vec3 pos1 = position + 15.;
    vec3 pos2 = position + 30.;

    mat2 rotation0 = r(t0);
    mat2 rotation1 = r(t1);
    mat2 rotation2 = r(t2);

    pos0.yz = rotation0 * pos0.yz;
    pos1.xy = rotation1 * pos1.xy;
    pos2.xz = rotation2 * pos2.xz;

    vLayer0 = pos0;
    vLayer1 = pos1;
    vLayer2 = pos2;

}
