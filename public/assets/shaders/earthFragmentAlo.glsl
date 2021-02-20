uniform float time;
uniform sampler2D aTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vAngle;
varying float vOpacity;
varying float vLife;
varying float vDirection;

mat2 rotate(float a){

    float c = cos(a);
    float s = sin(a);

    s *= vDirection;

    return mat2(c,-s,s,c);

}

void main() {

    vec2 pos = (gl_PointCoord - 0.5) * rotate(vNormal.z)  + 0.5;
    vec4 mask = texture2D(aTexture,pos);

    float g = 1. - vLife;

    gl_FragColor = vec4(0.,0.8,1.,1.);
    gl_FragColor.a *=  mask.r * 0.2 * vOpacity;

}
