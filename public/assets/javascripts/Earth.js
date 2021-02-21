Earth.prototype = Object.create(Object.prototype);
Earth.prototype.constructor = Earth;

function Earth( parameters ) {

    this.asset = asset;
    this.scene = parameters.scene;
    this.cubeScene = new parameters.THREE.Scene();

    //Const
    this.THREE = parameters.THREE;
    this.APP_SCALE = 10000;
    this.APP_TIME_SCALE = 20000;
    this.APP_DAY_MS = 86400000;
    this.RADIUS = 6371;
    this.CIRCONVOLUTION = (27 * this.APP_DAY_MS) / this.APP_TIME_SCALE;
    this.X_ROTATION = this.toRadians(15);
    this.Y_ROTATION = this.toRadians(123);
    this.Z_ROTATION = this.toRadians(20);
    this.RAY_LIFE_TIME = 240;
    this.POINT_SCALE_REF = 1009;

    //Shaders
    this.vertexShader = null;
    this.fragmentShader = null;
    this.vertexShaderAlo = null;
    this.fragmentShaderAlo = null;
    this.getVertexShader();
    this.getFragmentShader();

    //textures
    this.map = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_m.png`);
    this.normalMap = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_n.jpg`);
    this.glowTexture = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_glow.png`);

    //Clouds cube
    this.cubeTarget = null;
    this.cubeCamera = null;
    this.cubeTexture = null;

    this.cubeScene.background = this.textureCube;


    //Base
    this.baseGeometry = null;
    this.baseMaterial = null;

    //Clouds
    this.cloudsGeometry = null;
    this.cloudsMaterial = null;

    //Alo
    this.aloGeometry = null;
    this.aloMaterial = null;

    //Glow
    this.glowGeometry = null;
    this.glowMaterial = null;

    this.setCube(parameters);
    this.setBase(parameters);
    this.setClouds(parameters);
    this.setAlo(parameters);
    this.setGlow(parameters);
    this.listeners();

    this.meshBase = new this.THREE.Mesh(this.baseGeometry,this.baseMaterial);
    this.meshClouds = new this.THREE.Mesh(this.cloudsGeometry,this.cloudsMaterial);
    this.meshAlo = new this.THREE.Mesh(this.aloGeometry,this.aloMaterial);
    this.meshGlow = new this.THREE.Mesh(this.glowGeometry,this.glowMaterial);
    //this.meshGlow.position.set(0.3,0,0,);
    //this.meshGlow.rotation.set(0,this.toRadians(-90),0,);

    this.earthMesh = new parameters.THREE.Group();

    this.earthMesh.add(this.meshBase);
    this.earthMesh.add(this.meshClouds);
    this.earthMesh.add(this.meshAlo);
    this.earthMesh.add(this.meshGlow);

    this.meshBase.rotation.set(this.X_ROTATION,this.Y_ROTATION,this.Z_ROTATION);
    this.scene.add(this.earthMesh);

    this.earthMesh.visible = false;

}

Earth.prototype.listeners = function (){

    const t = this;

    _(window).on('LOCATION_CHANGE',(e) => {

        if(e.data.location === 'earth'){

            t.earthMesh.visible = true;

        }else{

            t.earthMesh.visible = false;

        }

    });

};

Earth.prototype.setCube = function (parameters){

    const t = this;
    const loader = new this.THREE.CubeTextureLoader();

    t.cubeTarget = new parameters.THREE.WebGLCubeRenderTarget( 1024, {
        format: parameters.THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: parameters.THREE.LinearMipmapLinearFilter
    } );

    t.cubeCamera = new parameters.THREE.CubeCamera( 0.1, 100000, t.cubeTarget );

    loader.setPath( `${asset}assets/images/earth/` );

    t.textureCube = loader.load( [
        'right.jpg', 'left.jpg',
        'top.jpg', 'bottom.jpg',
        'back.jpg', 'front.jpg'
    ] );

    this.cubeScene.background = t.textureCube;

};

Earth.prototype.setBase = function(parameters){

    const t = this;

    t.baseGeometry = new parameters.THREE.SphereBufferGeometry(
        this.RADIUS / this.APP_SCALE,
        64,
        64
    );


    t.baseMaterial = new parameters.THREE.MeshStandardMaterial({
        map : t.map,
        normalMap : t.normalMap,
        roughness : 1,
        metalness : 0
    });

};

Earth.prototype.setClouds = function (parameters){

    const t = this;

    t.cloudsGeometry = new parameters.THREE.SphereBufferGeometry(
        (this.RADIUS / this.APP_SCALE) + 0.001,
        64,
        64
    );

    t.cloudsMaterial = new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShader,
        fragmentShader : t.fragmentShader,
        uniforms : t.getUniforms(),
        side : parameters.THREE.FrontSide,
        vertexColors : true,
        transparent : true,
        depthWrite : false,
        depthTest : false
    });

};

Earth.prototype.setAlo = function (parameters){

    const t = this;

    t.aloGeometry = new parameters.THREE.SphereBufferGeometry(
        (this.RADIUS / this.APP_SCALE) + 0.005,
        64,
        64
    );

    t.aloMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderAlo,
        fragmentShader : t.fragmentShaderAlo,
        uniforms : t.getUniformsAlo(),
        side : parameters.THREE.FrontSide,
        transparent : true,
    });

};

Earth.prototype.setGlow = function (parameters){

    const t = this;

    t.glowGeometry = new parameters.THREE.PlaneBufferGeometry(
        2,
        2,
    );

    t.glowMaterial =  new parameters.THREE.MeshBasicMaterial({
        side : parameters.THREE.DoubleSide,
        map : t.glowTexture,
        transparent : true
    });

};

Earth.prototype.getVertexShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/earthVertex.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.vertexShader = r.responseText;

        }
    };

    r.send();

    const r1 = new XMLHttpRequest();

    r1.open('get',`${t.asset}assets/shaders/earthVertexAlo.glsl`,false);
    r1.onreadystatechange = () => {
        if(r1.readyState === 4 && r1.status === 200){

            t.vertexShaderAlo = r1.responseText;

        }
    };

    r1.send();

};

Earth.prototype.getFragmentShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/earthFragment.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.fragmentShader = r.responseText;

        }
    };

    r.send();

    const r1 = new XMLHttpRequest();

    r1.open('get',`${t.asset}assets/shaders/earthFragmentAlo.glsl`,false);
    r1.onreadystatechange = () => {
        if(r1.readyState === 4 && r1.status === 200){

            t.fragmentShaderAlo = r1.responseText;

        }
    };

    r1.send();

};

Earth.prototype.getUniforms = function(){

    return {
        time : {value : 0},
        mTexture : {value : null}
    };

};

Earth.prototype.getUniformsAlo = function(){

    return {
        time : {value : 0}
    };

};

Earth.prototype.update = function(renderer,camera,time,elapsed){

    const t = this;

    if(t.meshBase){

        //Cube
        t.cubeCamera.update( renderer, t.cubeScene );

        //Clouds
        t.cloudsMaterial.uniforms.time.value = time;
        t.cloudsMaterial.uniforms.mTexture.value =  t.cubeTarget.texture;

        //Alo
        t.aloMaterial.uniforms.time.value = time;

        //Glow
        t.meshGlow.lookAt(camera.position);

        //Rotation
        t.meshBase.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);
        t.meshClouds.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);


    }

};

Earth.prototype.toRadians = function (deg){

    return deg * (Math.PI / 180);

}

module.exports = Earth;
