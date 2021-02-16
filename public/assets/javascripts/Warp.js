Warp.prototype = Object.create(Object.prototype);
Warp.prototype.constructor = Warp;

function Warp(THREE,TWEEN){

    //Const
    this.THREE = THREE;
    this.TWEEN = TWEEN;

    //Shaders
    this.vertexShader = null;
    this.fragmentShader = null;

    //Particles
    this.warpMaterial = null;
    this.warpGeometry = null;
    this.warpMesh = null;

    //Elements
    this.stage3D = _('#warp-stage');

    this.particles = [];

    this.getShaders();
    this.setMesh();
    this.listeners();

}

Warp.prototype.getShaders = function (){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${asset}assets/shaders/warpVertex.glsl`,false);
    r.onreadystatechange = () => {

        if(r.readyState === 4 && r.status === 200){

            t.vertexShader = r.responseText;

        }

    }
    r.send();

    const r1 = new XMLHttpRequest();

    r1.open('get',`${asset}assets/shaders/warpFragment.glsl`,false);
    r1.onreadystatechange = () => {

        if(r1.readyState === 4 && r1.status === 200){

            t.fragmentShader = r1.responseText;

        }

    }
    r1.send();

};

Warp.prototype.setMesh = function (){

    const t = this;

    t.warpGeometry = new t.THREE.BufferGeometry();

    t.warpMaterial =  new t.THREE.ShaderMaterial({
        vertexShader : t.vertexShader,
        fragmentShader : t.fragmentShader,
        uniforms : t.getUniforms(),
        side : t.THREE.DoubleSide,
        depthTest : false,
        depthWrite : false,
        transparent : true,
        vertexColors : true
    });

    t.warpMesh = new t.THREE.Points(t.warpGeometry,t.warpMaterial);

};

Warp.prototype.getUniforms = function (){

    const t = this;

    return {

        time : {value : 0}

    }

};

Warp.prototype.listeners = function (){

    const t = this;

    _(window).on('WARP',() => t.startWarp());

};

Warp.prototype.startWarp = function (){

    const t = this;

    t.stage3D.disabled(false);

};

module.exports = Warp;
