App.prototype = Object.create(Module.prototype);
App.prototype.constructor = App;

function App(THREE,TWEEN,ORBIT_CONTROLS,asset) {

    Module.call(this);

    //Imports
    const AudioController = this.require(asset,'assets/javascripts/AudioController');
    const InfoController = this.require(asset,'assets/javascripts/InfoController');
    const Sun = this.require(asset,'assets/javascripts/Sun');
    const Earth = this.require(asset,'assets/javascripts/Earth');
    const Moon = this.require(asset,'assets/javascripts/Moon');
    const Warp = this.require(asset,'assets/javascripts/Warp');

    //Const
    this.APP_SCALE = 10000;
    this.TIME_STEP = 0.1;
    this.THREE = THREE;
    this.TWEEN = TWEEN;
    this.ORBIT_CONTROLS = ORBIT_CONTROLS;
    this.SUN_Z_DISTANCE = 215;
    this.EARTH_Z_DISTANCE = 1.8;
    this.MOON_Z_DISTANCE = 0.5;
    this.EARTH_X_DISTANCE = 152000000 / this.APP_SCALE;
    this.MOON_X_DISTANCE = 152384400 / this.APP_SCALE;
    this.COORDINATES = {
        sun : new THREE.Vector3(0,0,this.SUN_Z_DISTANCE),
        earth : new THREE.Vector3(this.EARTH_X_DISTANCE,0,this.EARTH_Z_DISTANCE),
        moon : new THREE.Vector3(this.MOON_X_DISTANCE,0,this.MOON_Z_DISTANCE),
    }
    this.LOOK_AT = {
        sun : new THREE.Vector3(),
        earth :new THREE.Vector3(this.EARTH_X_DISTANCE,0,0),
        moon : new THREE.Vector3(this.MOON_X_DISTANCE,0,0),
    }

    this.asset = asset;

    //Controllers
    this.audio = new AudioController();
    this.info = new InfoController();

    //Warp
    this.warp = new Warp(THREE,TWEEN);

    //Scene
    this.renderer = null;
    this.camera = null;
    this.scene = new this.THREE.Scene();
    this.controls = null;

    //Lights
    this.ambient = null;

    //Stage
    this.stage = _('#system-stage');

    //Stars
    this.sun = new Sun({
        THREE,
        TWEEN,
        scene : this.scene,
    });

    this.earth = new Earth({
        THREE,
        TWEEN,
        scene : this.scene,
    });

    this.moon = new Moon({
        THREE,
        TWEEN,
        scene : this.scene,
    });

    //Variables
    this.time = 0;
    this.before = performance.now();
    this.now = this.before;
    this.elapsed = 0;
    this.currentLocation = 'sun';

    //Booleans
    this.onSun = true;
    this.onEarth = false;
    this.onMoon = false;

    this.initRenderer();
    this.initCamera();
    this.initLights();
    //this.initControls();
    this.listeners();
    this.render();

}

App.prototype.render = function(){

    const t = this;

    t.now = performance.now();
    t.elapsed = t.now - t.before;
    t.before += t.elapsed;


    t.time += t.TIME_STEP;

    if(t.onSun){

        t.sun.update(t.renderer,t.camera,t.time,t.elapsed);

    }else if(t.onEarth){

        t.earth.update(t.renderer,t.camera,t.time,t.elapsed);

    } else if(t.onMoon){

        t.moon.update(t.renderer,t.camera,t.time,t.elapsed);

    }

    t.renderer.render(t.scene,t.camera);
    requestAnimationFrame(() => t.render());

};

App.prototype.initCamera = function(){

    const t = this;

    t.camera = new t.THREE.PerspectiveCamera(50,window.innerWidth / window.innerHeight,0.1,1000);

    //t.camera.position.copy(t.COORDINATES[t.currentLocation]);
    //t.camera.lookAt(new t.THREE.Vector3());

    t.camera.position.copy(t.COORDINATES['earth']);
    t.camera.lookAt(t.LOOK_AT['earth']);
    t.onSun = false;
    t.onEarth = true;

};

App.prototype.initLights = function (){

    const t = this;

    t.ambient = new t.THREE.AmbientLight(0xffffff,1);
    t.scene.add(t.ambient);

};

App.prototype.initControls = function(){

    const t = this;

    t.controls = new t.ORBIT_CONTROLS( t.camera, t.renderer.domElement );
    t.controls.enableZoom = false;

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
    //t.renderer.outputEncoding = t.THREE.sRGBEncoding;

    t.stage.append(t.renderer.domElement);

};

App.prototype.listeners = function () {

    const t = this;

    _(window).bind('resize',() => t.resize());

    _(window).on('FLY',() => t.turnCamera());

    _(window).on('FLY_OVER',() => setTimeout(() => t.showNewLocation(),1000));

};

App.prototype.turnCamera = function (back){

    const t = this;

    const startRotation = t.camera.rotation.x;
    let radians = 180 * (Math.PI / 180);

    if(back){

        radians *= -1;

    }

    t.controls.enabled = false;

    jTS.jAnimate(3000,(progress) => {

        t.camera.rotation.x = startRotation + (progress * radians);

    },{

        timing_function : 'accelerate',
        ease_in_out : true,
        callback : () => {

            if(back){

                t.controls.enabled = true;

            }else{

                _(window).emits('WARP');
                t.setNextLocation();

            }

        }

    });


};

App.prototype.setNextLocation = function (){

    const t = this;

    switch (t.currentLocation){

        case 'sun' :
            t.onSun = false;
            t.currentLocation = 'earth'
            break;
        case 'earth' :
            t.onEarth = false;
            t.currentLocation = 'moon';
            break;
        case 'moon' :
            t.onMoon = false;
            t.currentLocation = 'sun';
            break;

    }

    setTimeout(() => {

        t.camera.position.copy(t.COORDINATES[t.currentLocation]);
        t.camera.lookAt(t.LOOK_AT[t.currentLocation]);
        t.camera.rotation.set(180 * (Math.PI / 180),0,0);

    },1500);


    _(window).emits('LOCATION_CHANGE',{

        location : t.currentLocation

    });

};

App.prototype.showNewLocation = function (){

    const t = this;

    switch (t.currentLocation){

        case 'sun' :
            t.onSun = true;
            t.controls.target = t.LOOK_AT['sun'];
            break;
        case 'earth' :
            t.onEarth = true;
            t.controls.target = t.LOOK_AT['earth'];
            break;
        case 'moon' :
            t.onMoon = true;
            t.controls.target = t.LOOK_AT['moon'];
            break;

    }

    t.turnCamera(true);

};

App.prototype.resize = function () {

    const t = this;

    t.camera.aspect = window.innerWidth / window.innerHeight;
    t.camera.updateProjectionMatrix();

    t.renderer.setSize( window.innerWidth, window.innerHeight );

};
