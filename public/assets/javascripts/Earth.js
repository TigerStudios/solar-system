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
    this.X_POSITION = 152000000 / this.APP_SCALE;
    this.X_ROTATION = this.toRadians(15);
    this.Y_ROTATION = this.toRadians(123);
    this.Z_ROTATION = this.toRadians(20);

    //Shaders
    this.vertexShader = null;
    this.fragmentShader = null;
    this.getVertexShader();
    this.getFragmentShader();

    //textures
    this.map = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_m.png`);
    this.normalMap = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_n.jpg`);
    this.cloudsTexture = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_clouds.jpg`);

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

    this.setCube(parameters);
    this.setBase(parameters);
    this.setClouds(parameters);

    this.meshBase = new this.THREE.Mesh(this.baseGeometry,this.baseMaterial);
    this.meshClouds = new this.THREE.Mesh(this.cloudsGeometry,this.cloudsMaterial);
    this.meshBase.rotation.set(this.X_ROTATION,this.Y_ROTATION,this.Z_ROTATION);


    this.earthMesh = new parameters.THREE.Group();

    this.earthMesh.add(this.meshBase);
    this.earthMesh.add(this.meshClouds);

    this.earthMesh.position.set(this.X_POSITION,0,0);

    this.scene.add(this.earthMesh);

}

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

};

Earth.prototype.getUniforms = function(){

    return {
        time : {value : 0},
        mTexture : {value : this.cloudsTexture}
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

        //Rotation
        t.meshBase.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);
        t.meshClouds.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

    }

};

Earth.prototype.toRadians = function (deg){

    return deg * (Math.PI / 180);

}

module.exports = Earth;
