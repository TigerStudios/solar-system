Sun.prototype = Object.create(Object.prototype);
Sun.prototype.constructor = Sun;

function Sun( parameters ) {

    this.asset = asset;
    this.scene = parameters.scene;
    this.cubeScene = new parameters.THREE.Scene();

    //Const
    this.APP_SCLAE = 10000;
    this.APP_TIME_SCALE = 20000;
    this.APP_DAY_MS = 86400000;
    this.RADIUS = 696340;
    this.CIRCONVOLUTION = (27 * this.APP_DAY_MS) / this.APP_TIME_SCALE;

    //Shaders
    this.vertexShaderRenderd = null;
    this.fragmentShaderRendered = null;
    this.vertexShaderCube = null;
    this.fragmentShaderCube = null;
    this.vertexShaderAlo = null;
    this.fragmentShaderAlo = null;

    this.getVertexShader();
    this.getFragmentShader();

    this.cubeTarget = null;
    this.cubeCamera = null;
    this.cubeGeometry = null;
    this.cubeMaterial = null;

    this.renderedGeometry = null;
    this.renderedMaterial = null;

    this.aloGeometry = null;
    this.aloMaterial = null;

    this.setCube(parameters);
    this.setRendered(parameters);
    this.setAlo(parameters);

    this.meshCube = new parameters.THREE.Mesh(this.cubeGeometry,this.cubeMaterial);
    this.meshRendered = new parameters.THREE.Mesh(this.renderedGeometry,this.renderedMaterial);
    this.meshAlo = new parameters.THREE.Mesh(this.aloGeometry,this.aloMaterial);

    this.sunMesh = new parameters.THREE.Group();

    this.sunMesh.add(this.meshRendered);
    //this.sunMesh.add(this.meshAlo);

    this.cubeScene.add(this.meshCube);
    this.scene.add(this.sunMesh);

}

Sun.prototype.setCube = function(parameters){

    const t = this;

    t.cubeTarget = new parameters.THREE.WebGLCubeRenderTarget( 1024, {
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
        side : parameters.THREE.DoubleSide,
        blending : parameters.THREE.AdditiveBlending,
        depthTest : false,
        depthWrite : false,
        transparent : true,
        vertexColors : true
    });

};

Sun.prototype.setRendered = function(parameters){

    const t = this;

    t.renderedGeometry = new parameters.THREE.SphereBufferGeometry(
        this.RADIUS / this.APP_SCLAE,
        64,
        64
    );

    t.renderedMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderRenderd,
        fragmentShader : t.fragmentShaderRendered,
        uniforms : t.getUniformsRendered(),
        //side : parameters.THREE.DoubleSide,
        blending : parameters.THREE.AdditiveBlending,
        depthTest : false,
        depthWrite : false,
        transparent : true,
        vertexColors : true
    });

};

Sun.prototype.setAlo = function(parameters){

    const t = this;

    t.aloGeometry = new parameters.THREE.SphereBufferGeometry(
        (this.RADIUS / this.APP_SCLAE) + 20,
        64,
        64
    );

    t.aloMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderAlo,
        fragmentShader : t.fragmentShaderAlo,
        uniforms : t.getUniformsAlo(),
        side : parameters.THREE.BackSide,
        //blending : parameters.THREE.AdditiveBlending,
        depthTest : false,
        depthWrite : false,
        //transparent : true,
        //vertexColors : true
    });

};

Sun.prototype.getVertexShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/sunVertexCube.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.vertexShaderCube = r.responseText;

        }
    };

    r.send();

    const r1 = new XMLHttpRequest();

    r1.open('get',`${t.asset}assets/shaders/sunVertexRendered.glsl`,false);
    r1.onreadystatechange = () => {
        if(r1.readyState === 4 && r1.status === 200){

            t.vertexShaderRenderd = r1.responseText;

        }
    };

    r1.send();

    const r2 = new XMLHttpRequest();

    r2.open('get',`${t.asset}assets/shaders/sunVertexAlo.glsl`,false);
    r2.onreadystatechange = () => {
        if(r2.readyState === 4 && r2.status === 200){

            t.vertexShaderAlo = r2.responseText;

        }
    };

    r2.send();


};

Sun.prototype.getFragmentShader = function(){

    const t = this;

    const r = new XMLHttpRequest();

    r.open('get',`${t.asset}assets/shaders/sunFragmentCube.glsl`,false);
    r.onreadystatechange = () => {
        if(r.readyState === 4 && r.status === 200){

            t.fragmentShaderCube = r.responseText;

        }
    };

    r.send();

    const r1 = new XMLHttpRequest();

    r1.open('get',`${t.asset}assets/shaders/sunFragmentRendered.glsl`,false);
    r1.onreadystatechange = () => {
        if(r1.readyState === 4 && r1.status === 200){

            t.fragmentShaderRendered = r1.responseText;

        }
    };

    r1.send();

    const r2 = new XMLHttpRequest();

    r2.open('get',`${t.asset}assets/shaders/sunFragmentAlo.glsl`,false);
    r2.onreadystatechange = () => {
        if(r2.readyState === 4 && r2.status === 200){

            t.fragmentShaderAlo = r2.responseText;

        }
    };

    r2.send();

};

Sun.prototype.getUniformsCube = function(){

    return {
        time : {value : 0},
    };

};

Sun.prototype.getUniformsRendered = function(){

    return {
        time : {value : 0},
        tCube : {value : null}
    };

};

Sun.prototype.getUniformsAlo = function(){

    return {
        time : {value : 0},
    };

};

Sun.prototype.update = function(renderer,time,elapsed){

    const t = this;

    if(t.cubeMaterial){

        t.cubeMaterial.uniforms.time.value = time;
        t.meshCube.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

        t.cubeCamera.update( renderer, t.cubeScene );

        t.renderedMaterial.uniforms.time.value = time;
        t.renderedMaterial.uniforms.tCube.value = t.cubeTarget.texture;

    }

};

module.exports = Sun;