Warp.prototype = Object.create(Object.prototype);
Warp.prototype.constructor = Warp;

function Warp(THREE,TWEEN){

    //Const
    this.THREE = THREE;
    this.TWEEN = TWEEN;
    this.CAMERA_Z_POS = 0;
    this.FLY_TIME = 12000;
    this.FLY_ACCELERATION = 3000;
    this.FLY_DELAY = (this.FLY_TIME * 0.5) + 500;

    //Shaders
    this.vertexShader = null;
    this.fragmentShader = null;

    //Texture
    this.warpTesxture = new THREE.TextureLoader().load(`${asset}assets/images/warp/warp-stars.png`);
    this.warpTesxture.wrapT = this.THREE.RepeatWrapping;
    this.warpTesxture.wrapS = this.THREE.RepeatWrapping;
    this.warpTesxture.repeat.x = 200;
    this.warpTesxture.repeat.y = 200;

    //Particles
    this.warpMaterial = null;
    this.warpGeometry = null;
    this.warpMesh = null;
    this.warpMesh2 = null;

    //Scene
    this.scene = new THREE.Scene();
    this.camera = null;
    this.renderer = null;

    //Elements
    this.stage3D = _('#warp-stage');

    //Variables
    this.particles = [];
    this.warping = false;
    this.time = 0;
    this.stretch = -1;

    this.getShaders();
    this.setMesh();
    this.listeners();

    this.initCamera();
    this.initRenderer();

}

Warp.prototype.initCamera = function(){

    const t = this;

    t.camera = new t.THREE.PerspectiveCamera(30,window.innerWidth / window.innerHeight,0.1,10000);

    t.camera.position.set(0,0,t.CAMERA_Z_POS);
    t.camera.lookAt(new t.THREE.Vector3());

};

Warp.prototype.initRenderer = function(){

    const t = this;

    t.renderer = new t.THREE.WebGLRenderer({

        antialias : true,
        powerPreference : 'high-performance',
        alpha : false,

    });

    t.renderer.setPixelRatio( window.devicePixelRatio );
    t.renderer.setSize( window.innerWidth , window.innerHeight );
    t.renderer.shadowMap.enabled = true;
    t.renderer.shadowMap.type = t.THREE.PCFSoftShadowMap;
    t.renderer.outputEncoding = t.THREE.sRGBEncoding;

    t.stage3D.append(t.renderer.domElement);

};

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

    t.warpGeometry = new t.THREE.BoxBufferGeometry(50,50,20);

    t.warpMaterial =  new t.THREE.ShaderMaterial({
        vertexShader : t.vertexShader,
        fragmentShader : t.fragmentShader,
        uniforms : t.getUniforms(),
        side : t.THREE.DoubleSide,
        transparent : true,
        vertexColors : true
    });

    t.warpMesh = new t.THREE.Mesh(t.warpGeometry,t.warpMaterial);

    t.scene.add(t.warpMesh);

};

Warp.prototype.getUniforms = function (){

    const t = this;

    return {

        iTime : {value : 0},
        iChannel0 : {value : t.warpTesxture},
        uStretch : {value : -1},
        iResolution : {value : new t.THREE.Vector3(window.innerWidth,window.innerHeight,0)},

    }

};

Warp.prototype.listeners = function (){

    const t = this;

    _(window).bind('resize',() => t.resize());

    _(window).on('WARP',() => t.startWarp());

};

Warp.prototype.startWarp = function (){

    const t = this;

    t.time = 0;
    t.stretch = -1;

    t.stage3D.disabled(false);
    t.warping = true;

    t.updateMaterialUniforms();

    this.renderer.render(this.scene,this.camera);

    jTS.jAnimate(t.FLY_ACCELERATION,(progress) => {

        t.stretch = -1 + (2 * progress);

    },{

        timing_function : 'accelerate',
        coefficient : 2,
        callback : () => jTS.jAnimate(t.FLY_ACCELERATION,(progress) => {

            t.stretch = -1 + (2 * progress)

        },{

            timing_function : 'accelerate',
            coefficient : 2,
            ease_out : true,
            delay : t.FLY_DELAY,
            reverse : true

        })

    });

    jTS.jAnimate(t.FLY_TIME * 0.5,(progress) => {

        t.time = 10 * progress;

    },{

        timing_function : 'accelerate',
        coefficient : 2,
        callback : () => jTS.jAnimate(t.FLY_TIME * 0.5 , (progress) => {

            t.time = 10 * progress;

        },{

            timing_function : 'accelerate',
            coefficient : 2,
            ease_out : true,
            callback : () => t.stopWarp()

        })

    });

    t.update();

};

Warp.prototype.stopWarp = function (){

    const t = this;

    t.warping = false;
    t.stage3D.disabled(true);
    _(window).emits('FLY_OVER');

}

Warp.prototype.resize = function () {

    const t = this;

    t.camera.aspect = window.innerWidth / window.innerHeight;
    t.camera.updateProjectionMatrix();

    t.renderer.setSize( window.innerWidth, window.innerHeight );

};

Warp.prototype.updateMaterialUniforms = function (){

    const t = this;

    const width =  window.innerWidth * devicePixelRatio;
    const height =  window.innerHeight * devicePixelRatio;

    t.warpMaterial.uniforms.iTime.value = t.time;
    t.warpMaterial.uniforms.uStretch.value = t.stretch;
    t.warpMaterial.uniforms.iResolution.value = new t.THREE.Vector3(width,height,0);

}

Warp.prototype.update = function(){

    const t = this;

    t.updateMaterialUniforms();
    t.renderer.render(t.scene,t.camera);

    if(t.warping){

        requestAnimationFrame(() => t.update());

    }

}

module.exports = Warp;
