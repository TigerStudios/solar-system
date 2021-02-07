Sun.prototype = Object.create(Object.prototype);
Sun.prototype.constructor = Sun;

function Sun( parameters ) {

    this.asset = asset;
    this.scene = parameters.scene;
    this.cubeScene = new parameters.THREE.Scene();

    //Const
    this.APP_SCLAE = 10000;
    this.APP_TIME_SCALE = 10000;
    this.APP_DAY_MS = 86400000;
    this.RADIUS = 696340;
    this.CIRCONVOLUTION = (27 * this.APP_DAY_MS) / this.APP_TIME_SCALE;

    //Shaders
    this.vertexShader = null;
    this.fragmentShader = null;
    this.vertexShaderCube = null;
    this.fragmentShaderCube = null;

    this.getVertexShader();
    this.getFragmentShader();

    this.geometry = this.setGeometry(parameters);
    this.material = this.setMaterial(parameters);

    this.cubeTarget = null;
    this.cubeCamera = null;

    this.cubeGeometry = null;
    this.cubeMaterial = null;

    this.setCube(parameters);

    this.mesh = new parameters.THREE.Mesh(this.geometry,this.material);
    this.meshCube = new parameters.THREE.Mesh(this.cubeGeometry,this.cubeMaterial);

    this.cubeScene.add(this.mesh);
    this.scene.add(this.meshCube);

}

Sun.prototype.setCube = function(parameters){

    const t = this;

    t.cubeTarget = new parameters.THREE.WebGLCubeRenderTarget( 512, {
        format: parameters.THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: parameters.THREE.LinearMipmapLinearFilter
    } );

    t.cubeCamera = new parameters.THREE.CubeCamera( 0.1, 100000, t.cubeTarget );

    t.cubeGeometry = new parameters.THREE.SphereBufferGeometry(
        this.RADIUS / this.APP_SCLAE,
        64,
        64
    );

    t.cubeMaterial = new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderCube,
        fragmentShader : t.fragmentShaderCube,
        uniforms : t.getUniformsCube(),
        //side : parameters.THREE.DoubleSide,
        blending : parameters.THREE.AdditiveBlending,
        depthTest : false,
        depthWrite : false,
        transparent : true,
        vertexColors : true
    });

};

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
        side : parameters.THREE.DoubleSide,
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

    const r1 = new XMLHttpRequest();

    r1.open('get',`${t.asset}assets/shaders/sunVertexCube.glsl`,false);
    r1.onreadystatechange = () => {
        if(r1.readyState === 4 && r1.status === 200){

            t.vertexShaderCube = r1.responseText;

        }
    };

    r1.send();


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

    const r1 = new XMLHttpRequest();

    r1.open('get',`${t.asset}assets/shaders/sunFragmentCube.glsl`,false);
    r1.onreadystatechange = () => {
        if(r1.readyState === 4 && r1.status === 200){

            t.fragmentShaderCube = r1.responseText;

        }
    };

    r1.send();

};

Sun.prototype.getUniforms = function(){

    return {
        time : {value : 0}
    };

};

Sun.prototype.getUniformsCube = function(){

    return {
        time : {value : 0},
        tCube : {value : null}
    };

};

Sun.prototype.update = function(renderer,time,elapsed){

    const t = this;

    if(t.cubeMaterial){

        t.material.uniforms.time.value = time;
        t.mesh.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

        t.cubeCamera.update( renderer, t.cubeScene );


        t.cubeMaterial.uniforms.time.value = time;
        t.cubeMaterial.uniforms.tCube.value = t.cubeTarget.texture;

    }

};

module.exports = Sun;