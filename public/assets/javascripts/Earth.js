Earth.prototype = Object.create(Object.prototype);
Earth.prototype.constructor = Earth;

function Earth( parameters ) {

    this.asset = asset;
    this.scene = parameters.scene;

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
    this.vertexShaderRenderd = null;
    this.fragmentShaderRendered = null;
    //this.getVertexShader();
    //this.getFragmentShader();

    //textures
    this.map = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_m.png`);
    this.normalMap = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_n.jpg`);
    this.cloudstexture = new this.THREE.TextureLoader().load(`${asset}assets/images/earth/earth_clouds.jpg`);

    this.baseGeometry = null;
    this.baseMaterial = null;

    this.setBase(parameters);

    this.meshBase = new this.THREE.Mesh(this.baseGeometry,this.baseMaterial);
    this.meshBase.rotation.set(this.X_ROTATION,this.Y_ROTATION,this.Z_ROTATION);

    this.earthMesh = new parameters.THREE.Group();
    this.earthMesh.position.set(this.X_POSITION,0,0);

    this.earthMesh.add(this.meshBase);
    this.scene.add(this.earthMesh);

}

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

Earth.prototype.getVertexShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/earthVertex.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.vertexShaderRenderd = r.responseText;

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

            t.fragmentShaderRendered = r.responseText;

        }
    };

    r.send();

};

Earth.prototype.getUniformsRendered = function(){

    return {
        time : {value : 0},
        mTexture : {value : null}
    };

};

Earth.prototype.update = function(renderer,camera,time,elapsed){

    const t = this;

    if(t.meshBase){

        //Base
        t.meshBase.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

        //Update and render textures
        //t.renderedMaterial.uniforms.time.value = time;
        //.renderedMaterial.uniforms.mTexture.value = t.moonTexture;

    }

};

Earth.prototype.toRadians = function (deg){

    return deg * (Math.PI / 180);

}

module.exports = Earth;
