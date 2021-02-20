uniform float time;
uniform samplerCube mTexture;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying vec3 eyeVector;

varying vec3 vLayer0;
varying vec3 vLayer1;
varying vec3 vLayer2;

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

float fresnel(vec3 eyeVector , vec3 worldNormal){

    return pow(1.0 + dot(eyeVector,worldNormal) , 3.);

}

mat2 r(float a){

    float c = cos(a);
    float s = sin(a);

    return mat2(c,-s,s,c);

}

void main() {


    vec4 color0 = textureCube(mTexture,vLayer0) * 0.8;
    vec4 color1 = textureCube(mTexture,vLayer1) * 0.5;
    vec4 color2 = textureCube(mTexture,vLayer2) * 0.1;

    vec4 color =  color0;
    color += color1;
    color += color2;

    gl_FragColor = vec4(color);
    gl_FragColor.a = color.r;

}
