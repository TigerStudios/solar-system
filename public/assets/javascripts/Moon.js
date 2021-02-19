Moon.prototype = Object.create(Object.prototype);
Moon.prototype.constructor = Moon;

function Moon( parameters ) {

    this.asset = asset;
    this.scene = parameters.scene;

    //Const
    this.THREE = parameters.THREE;
    this.APP_SCALE = 10000;
    this.APP_TIME_SCALE = 20000;
    this.APP_DAY_MS = 86400000;
    this.RADIUS = 1737;
    this.CIRCONVOLUTION = (27 * this.APP_DAY_MS) / this.APP_TIME_SCALE;
    this.X_POSITION = 152384400 / this.APP_SCALE;

    //Shaders
    this.vertexShaderRenderd = null;
    this.fragmentShaderRendered = null;

    this.map =  new this.THREE.TextureLoader().load(`${asset}assets/images/moon/moon_c.jpg`);
    //this.displacementMap = new this.THREE.TextureLoader().load(`${asset}assets/images/moon/moon_d.jpg`);
    //this.getVertexShader();
    //this.getFragmentShader();

    this.renderedGeometry = null;
    this.renderedMaterial = null;

    this.setRendered(parameters);

    this.meshRendered = new this.THREE.Mesh(this.renderedGeometry,this.renderedMaterial);
    this.moonMesh = new parameters.THREE.Group();
    this.moonMesh.position.set(this.X_POSITION,0,0);

    this.moonMesh.add(this.meshRendered);
    this.scene.add(this.moonMesh);

}

Moon.prototype.setRendered = function(parameters){

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
        map : t.map,
        color : 0xffffff
    });

};

Moon.prototype.getVertexShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/moonVertex.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.vertexShaderRenderd = r.responseText;

        }
    };

    r.send();

};

Moon.prototype.getFragmentShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/moonFragment.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.fragmentShaderRendered = r.responseText;

        }
    };

    r.send();

};

Moon.prototype.getUniformsRendered = function(){

    return {
        time : {value : 0},
        mTexture : {value : null}
    };

};

Moon.prototype.update = function(renderer,camera,time,elapsed){

    const t = this;

    if(t.meshRendered){

        t.meshRendered.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

        //Update and render textures
        //t.renderedMaterial.uniforms.time.value = time;
        //.renderedMaterial.uniforms.mTexture.value = t.moonTexture;

    }

};

module.exports = Moon;
