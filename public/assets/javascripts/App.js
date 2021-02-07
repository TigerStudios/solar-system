App.prototype = Object.create(Module.prototype);
App.prototype.constructor = App;

function App(THREE,TWEEN,ORBIT_CONTROLS,asset) {

    Module.call(this);

    //Imports
    const Sun = this.require(asset,'assets/javascripts/Sun');

    //Const
    this.TIME_STEP = 0.1;

    this.THREE = THREE;
    this.TWEEN = TWEEN;
    this.ORBIT_CONTROLS = ORBIT_CONTROLS;
    this.SUN_Z_DISTANCE = 250;

    this.asset = asset;

    //Scene
    this.renderer = null;
    this.camera = null;
    this.scene = new this.THREE.Scene();
    this.controls = null;

    //Stage
    this.stage = _('#system-stage');

    //Stars
    this.sun = new Sun({
        THREE,
        TWEEN,
        scene : this.scene,
    });

    //Variables
    this.time = 0;
    this.before = performance.now();
    this.now = this.start;
    this.elapsed = 0;

    this.initRenderer();
    this.initCamera();
    this.initControls();
    this.listeners();
    this.render();


}

App.prototype.render = function(){

    const t = this;

    t.now = performance.now();
    t.elapsed = t.now - t.before;
    t.before += t.elapsed;


    t.time += t.TIME_STEP;

    t.sun.update(t.renderer,t.time,t.elapsed);

    t.renderer.render(t.scene,t.camera);
    requestAnimationFrame(() => t.render());

};

App.prototype.initCamera = function(){

    const t = this;

    t.camera = new t.THREE.PerspectiveCamera(50,window.innerWidth / window.innerHeight,0.1,10000);

    t.camera.position.set(0,0,t.SUN_Z_DISTANCE);
    t.camera.lookAt(new t.THREE.Vector3());

};

App.prototype.initControls = function(){

    const t = this;

    t.controls = new t.ORBIT_CONTROLS( t.camera, t.renderer.domElement );

};

App.prototype.initRenderer = function(){

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

    t.stage.append(t.renderer.domElement);

};

App.prototype.listeners = function () {

    const t = this;

    _(window).bind('resize',() => t.resize());
    
};

App.prototype.resize = function () {

    const t = this;

    t.camera.aspect = window.innerWidth / window.innerHeight;
    t.camera.updateProjectionMatrix();

    t.renderer.setSize( window.innerWidth, window.innerHeight );

};