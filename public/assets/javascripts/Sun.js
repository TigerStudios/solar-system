Sun.prototype = Object.create(Object.prototype);
Sun.prototype.constructor = Sun;

function Sun( parameters ) {

    this.asset = asset;

    //Const
    this.APP_SCLAE = 10000;
    this.APP_TIME_SCALE = 10000;
    this.APP_DAY_MS = 86400000;
    this.RADIUS = 696340;
    this.CIRCONVOLUTION = (27 * this.APP_DAY_MS) / this.APP_TIME_SCALE;

    //Shaders
    this.vertexShader = null;
    this.fragmentShader = null;
    this.getVertexShader();
    this.getFragmentShader();

    this.geometry = this.setGeometry(parameters);
    this.material = this.setMaterial(parameters);

    this.mesh = new parameters.THREE.Mesh(this.geometry,this.material);

    parameters.scene.add(this.mesh);

}

Sun.prototype.setGeometry = function(parameters){

    const t = this;

    return new parameters.THREE.SphereBufferGeometry(
        this.RADIUS / this.APP_SCLAE,
        64,
        64
    );

};

Sun.prototype.setMaterial = function(parameters){

    const t = this;

    return new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShader,
        fragmentShader : t.fragmentShader,
        uniforms : t.getUniforms(),
        blending : parameters.THREE.AdditiveBlending,
        depthTest : false,
        depthWrite : false,
        transparent : true,
        vertexColors : true
    });

};

Sun.prototype.getVertexShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/sunVertex.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.vertexShader = r.responseText;

        }
    };

    r.send();


};

Sun.prototype.getFragmentShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/sunFragment.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.fragmentShader = r.responseText;

        }
    };

    r.send();

};

Sun.prototype.getUniforms = function(){

    return {
        time : {value : 0}
    };

};

Sun.prototype.update = function(time,elapsed){

    const t = this;

    t.material.uniforms.time.value = time;

    t.mesh.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

};

module.exports = Sun;