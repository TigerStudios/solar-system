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
    this.CIRCONVOLUTION = this.APP_DAY_MS / this.APP_TIME_SCALE;
    this.X_POSITION = 152000000 / this.APP_SCALE;

    //Shaders
    this.vertexShaderRenderd = null;
    this.fragmentShaderRendered = null;

    //this.getVertexShader();
    //this.getFragmentShader();

    this.renderedGeometry = null;
    this.renderedMaterial = null;

    this.setRendered(parameters);

    this.meshRendered = new this.THREE.Mesh(this.renderedGeometry,this.renderedMaterial);
    this.earthMesh = new parameters.THREE.Group();
    this.earthMesh.position.set(this.X_POSITION,0,0);

    this.earthMesh.add(this.meshRendered);
    this.scene.add(this.earthMesh);

}

Earth.prototype.setRendered = function(parameters){

    const t = this;

    t.renderedGeometry = new parameters.THREE.SphereBufferGeometry(
        this.RADIUS / this.APP_SCALE,
        64,
        64
    );

    /*t.renderedMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderRenderd,
        fragmentShader : t.fragmentShaderRendered,
        uniforms : t.getUniformsRendered(),
        depthTest : false,
        depthWrite : false,
        vertexColors : true
    });*/

    t.renderedMaterial = new parameters.THREE.MeshBasicMaterial({
        color : 0xff00ff
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

    if(t.meshRendered){

        t.meshRendered.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

        //Update and render textures
        //t.renderedMaterial.uniforms.time.value = time;
        //.renderedMaterial.uniforms.mTexture.value = t.moonTexture;

    }

};

module.exports = Earth;
