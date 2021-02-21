uniform float time;

attribute float angle;
attribute float size;
attribute float opacity;
attribute float life;
attribute float direction;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
varying float vAngle;
varying float vOpacity;
varying float vLife;
varying float vDirection;

void main() {

    vec4 mvPosition = modelViewMatrix * vec4(position,1.);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = size;

    vUv = uv;
    vPosition = position;
    vNormal = normal;
    vAngle = angle;
    vOpacity = opacity;
    vLife = life;
    vDirection = direction;

}
