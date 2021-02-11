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
    this.SUN_Z_DISTANCE = 210;

    //Shaders
    this.vertexShaderRenderd = null;
    this.fragmentShaderRendered = null;
    this.vertexShaderCube = null;
    this.fragmentShaderCube = null;
    this.vertexShaderAlo = null;
    this.fragmentShaderAlo = null;
    this.vertexShaderRays = null;
    this.fragmentShaderRays = null;

    this.getVertexShader();
    this.getFragmentShader();

    this.cubeTarget = null;
    this.cubeCamera = null;
    this.cubeGeometry = null;
    this.cubeMaterial = null;

    this.renderedGeometry = null;
    this.renderedMaterial = null;

    this.aloTexture = new parameters.THREE.TextureLoader().load(`${asset}assets/images/sun/sun-glow.png`);
    this.aloGeometry = null;
    this.aloMaterial = null;

    this.raysTexture = new parameters.THREE.TextureLoader().load(`${asset}assets/images/sun/sun-rays.png`);
    this.raysGeometry = null;
    this.raysMaterial = null;

    this.setCube(parameters);
    this.setRendered(parameters);
    this.setAlo(parameters);
    this.setRays(parameters);

    this.meshCube = new parameters.THREE.Mesh(this.cubeGeometry,this.cubeMaterial);
    this.meshRendered = new parameters.THREE.Mesh(this.renderedGeometry,this.renderedMaterial);
    this.meshAlo = new parameters.THREE.Mesh(this.aloGeometry,this.aloMaterial);
    this.meshRays = new parameters.THREE.Mesh(this.raysGeometry,this.raysMaterial);

    this.sunMesh = new parameters.THREE.Group();

    this.sunMesh.add(this.meshRendered);
    this.sunMesh.add(this.meshAlo);
    this.sunMesh.add(this.meshRays);

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

    t.aloGeometry = new parameters.THREE.PlaneBufferGeometry(
        this.RADIUS / this.APP_SCLAE * 2.91 + 15,
        this.RADIUS / this.APP_SCLAE * 2.91 + 15,
        1,
        1
    );

    t.aloMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderAlo,
        fragmentShader : t.fragmentShaderAlo,
        uniforms : t.getUniformsAlo(),
        side : parameters.THREE.FrontSide,
        transparent : true
    });

};

Sun.prototype.setRays = function(parameters){

    const t = this;

    t.raysGeometry = new parameters.THREE.SphereBufferGeometry(
        this.RADIUS / this.APP_SCLAE + 1,
        64,
        64
    );

    t.raysMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderRays,
        fragmentShader : t.fragmentShaderRays,
        uniforms : t.getUniformsRays(),
        side : parameters.THREE.FrontSide,
        transparent : true
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

    const r3 = new XMLHttpRequest();

    r3.open('get',`${t.asset}assets/shaders/sunVertexRays.glsl`,false);
    r3.onreadystatechange = () => {
        if(r3.readyState === 4 && r3.status === 200){

            t.vertexShaderRays = r3.responseText;

        }
    };

    r3.send();


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

    const r3 = new XMLHttpRequest();

    r3.open('get',`${t.asset}assets/shaders/sunFragmentRays.glsl`,false);
    r3.onreadystatechange = () => {
        if(r3.readyState === 4 && r3.status === 200){

            t.fragmentShaderRays = r3.responseText;

        }
    };

    r3.send();

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
        sGlow : {value : this.aloTexture},
    };

};

Sun.prototype.getUniformsRays = function(){

    return {
        time : {value : 0},
        sRays : {value : this.raysTexture},
    };

};

Sun.prototype.update = function(renderer,camera,time,elapsed){

    const t = this;

    if(t.cubeMaterial){

        //Update and render original sphere texture
        t.cubeMaterial.uniforms.time.value = time;
        t.meshCube.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

        t.cubeCamera.update( renderer, t.cubeScene );

        //Update and render textures
        t.renderedMaterial.uniforms.time.value = time;
        t.renderedMaterial.uniforms.tCube.value = t.cubeTarget.texture;

        //Sun glow computation
        t.meshAlo.lookAt(camera.position);

        t.raysMaterial.uniforms.time.value = time;

        const distance = camera.position.distanceTo(t.meshRendered.position);
        let gap = t.SUN_Z_DISTANCE / distance;
        let scaleM = t.SUN_Z_DISTANCE - distance ;

        if(scaleM < 50){
            scaleM = 0.001;
        }else if(scaleM >= 50 && scaleM < 55){
            scaleM = 0.0012;
        }else if(scaleM >= 55 && scaleM < 60){
            scaleM = 0.00122;
        }else if(scaleM >= 60 && scaleM < 65){
            scaleM = 0.00127;
        }else if(scaleM >= 65 && scaleM < 70){
            scaleM = 0.00130;
        }else if(scaleM >= 70 && scaleM < 75){
            scaleM = 0.00135;
        }else if(scaleM >= 75 && scaleM < 80){
            scaleM = 0.00145;
        }else if(scaleM >= 80 && scaleM < 85){
            scaleM = 0.00165;
        }else if(scaleM >= 85 && scaleM < 90){
            scaleM = 0.00173;
        }else if(scaleM >= 90 && scaleM < 95){
            scaleM = 0.00182;
        }else if(scaleM >= 95 && scaleM < 100){
            scaleM = 0.0021;
        }else if(scaleM >= 100 && scaleM < 105){
            scaleM = 0.00235;
        }else if(scaleM >= 105 && scaleM < 110){
            scaleM = 0.00273;
        }else if(scaleM >= 110 && scaleM < 115){
            scaleM = 0.0032;
        }else if(scaleM >= 115 && scaleM < 120){
            scaleM = 0.00377;
        }else{
            scaleM = 0.005;
        }

        gap = gap <= 1 ? (gap - 1) * 0.07 : (t.SUN_Z_DISTANCE - distance) * scaleM;

        const scale = 1 + gap;
        t.meshAlo.scale.set(scale,scale,1);

    }

};

module.exports = Sun;