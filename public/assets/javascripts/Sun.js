Sun.prototype = Object.create(Object.prototype);
Sun.prototype.constructor = Sun;

function Sun( parameters ) {

    this.asset = asset;
    this.scene = parameters.scene;
    this.cubeScene = new parameters.THREE.Scene();

    //Const
    this.THREE = parameters.THREE;
    this.APP_SCLAE = 10000;
    this.APP_TIME_SCALE = 20000;
    this.APP_DAY_MS = 86400000;
    this.RADIUS = 696340;
    this.CIRCONVOLUTION = (27 * this.APP_DAY_MS) / this.APP_TIME_SCALE;
    this.SUN_Z_DISTANCE = 215;
    this.ALO_SIZE = 930;
    this.RAY_LIFE_TIME = 500;
    this.RAYS_STEP = 300;
    this.RAYS_2 = 5;
    this.RAY_2_LIFE_TIME = 500;
    this.RAYS_STEP_2 = 200;


    //Shaders
    this.vertexShaderRenderd = null;
    this.fragmentShaderRendered = null;
    this.vertexShaderCube = null;
    this.fragmentShaderCube = null;
    this.vertexShaderAlo = null;
    this.fragmentShaderAlo = null;
    this.vertexShaderRays = null;
    this.fragmentShaderRays = null;
    this.vertexShaderRays2 = null;
    this.fragmentShaderRays2 = null;

    this.getVertexShader();
    this.getFragmentShader();

    this.cubeTarget = null;
    this.cubeCamera = null;
    this.cubeGeometry = null;
    this.cubeMaterial = null;

    this.renderedGeometry = null;
    this.renderedMaterial = null;
    this.box3D = new this.THREE.Box3();
    this.sizeV = new this.THREE.Vector3();

    this.aloTexture = new parameters.THREE.TextureLoader().load(`${asset}assets/images/sun/sun-glow.png`);
    this.aloGeometry = null;
    this.aloMaterial = null;

    this.raysTexture = new parameters.THREE.TextureLoader().load(`${asset}assets/images/sun/rays_smoke.png`);
    this.raysGeometry = null;
    this.raysMaterial = null;
    this.raysParticles = [];
    this.raysStep = 0;

    this.rays2Texture = new parameters.THREE.TextureLoader().load(`${asset}assets/images/sun/rays_smoke_2.png`);
    this.rays2Geometry = null;
    this.rays2Material = null;
    this.rays2Particles = [];
    this.rays2Step = 0;

    this.setCube(parameters);
    this.setRendered(parameters);
    this.setAlo(parameters);
    this.setRays(parameters);
    this.setRays2(parameters);

    this.meshCube = new parameters.THREE.Mesh(this.cubeGeometry,this.cubeMaterial);
    this.meshRendered = new parameters.THREE.Mesh(this.renderedGeometry,this.renderedMaterial);
    this.meshAlo = new parameters.THREE.Mesh(this.aloGeometry,this.aloMaterial);
    this.meshRays = new parameters.THREE.Points(this.raysGeometry,this.raysMaterial);
    this.meshRays2 = new parameters.THREE.Points(this.rays2Geometry,this.rays2Material);

    this.sunMesh = new parameters.THREE.Group();

    this.sunMesh.add(this.meshRendered);
    this.sunMesh.add(this.meshAlo);
    this.sunMesh.add(this.meshRays);
    this.sunMesh.add(this.meshRays2);

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

    t.aloGeometry = new parameters.THREE.CircleBufferGeometry(
        this.RADIUS / this.APP_SCLAE * 1.57,
        128
    );

    t.aloMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderAlo,
        fragmentShader : t.fragmentShaderAlo,
        uniforms : t.getUniformsAlo(),
        side : parameters.THREE.DoubleSide,
        transparent : true
    });

};

Sun.prototype.setRays = function(parameters){

    const t = this;

    t.raysGeometry = new parameters.THREE.BufferGeometry();

    t.raysMaterial =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderRays,
        fragmentShader : t.fragmentShaderRays,
        uniforms : t.getUniformsRays(),
        side : parameters.THREE.FrontSide,
        depthTest : false,
        depthWrite : false,
        transparent : true,
        vertexColors : true,
    });

    this.addRaysParticles();
    this.setRaysParticles();

};

Sun.prototype.setRays2 = function(parameters){

    const t = this;

    t.rays2Geometry = new parameters.THREE.BufferGeometry();

    t.rays2Material =  new parameters.THREE.ShaderMaterial({
        vertexShader : t.vertexShaderRays2,
        fragmentShader : t.fragmentShaderRays2,
        uniforms : t.getUniformsRays2(),
        side : parameters.THREE.FrontSide,
        depthTest : false,
        depthWrite : false,
        transparent : true,
        vertexColors : true,
    });

    this.addRaysParticles2();
    this.setRaysParticles2();

};

Sun.prototype.addRaysParticles = function(){

    const t = this;

    const pos = t.renderedGeometry.attributes.position.array;
    const normal = t.renderedGeometry.attributes.normal.array;

    let index = 0;

    for(let i = 0; i < pos.length; i++){

        if(i % 3 === 2){

            t.raysParticles.push({

                position : new t.THREE.Vector3(
                    pos[index],
                    pos[index + 1],
                    pos[index + 2],
                ),
                normal : new t.THREE.Vector3(
                    normal[index],
                    normal[index + 1],
                    normal[index + 2],
                ),
                rotation : (Math.random() * 360) * (Math.PI / 180),
                velocity : Math.random() + 1,
                lifeTime : t.RAY_LIFE_TIME,
                life : 0,
                alpha : 0.5,
                direction : Math.random() > 0.5 ? 1.0 : -1.0,
                size : (150 + (Math.random() * 100)) * devicePixelRatio

            });

            index += 3;

        }

    }

};

Sun.prototype.addRaysParticles2 = function(){

    const t = this;

    const pos = t.renderedGeometry.attributes.position.array;

    let index = 0;

    for(let i = 0; i < pos.length; i++){

        if(i % 128 === 2){

            t.rays2Particles.push({

                position : new t.THREE.Vector3(
                    pos[index],
                    pos[index + 1],
                    pos[index + 2],
                ),

                rotation : (Math.random() * 360) * (Math.PI / 180),
                velocity : Math.random() + 1,
                lifeTime : t.RAY_LIFE_TIME,
                life : 0,
                alpha : 0.5,
                direction : Math.random() > 0.5 ? 1.0 : -1.0,
                size : (300 + (Math.random() * 250)) * devicePixelRatio

            });

            index += 128;

        }

    }

};

Sun.prototype.setRaysParticles = function(){

    const t = this;

    const position = [];
    const angle = [];
    const size = [];
    const opacity = [];
    const life = [];
    const direction = [];

    for(let i = 0; i < t.raysParticles.length; i++){

        const p = t.raysParticles[i];

        if(p.life > t.RAY_LIFE_TIME){

            t.raysParticles.splice(i,1);
            i--;

        }else{

            p.position = p.position.add(p.normal.multiplyScalar(p.velocity * 0.9));
            p.life += 1;
            p.alpha = p.life / (p.lifeTime * 0.5);

            if(p.alpha >= 1){

                p.alpha = 2 - p.alpha;

            }

            position.push(p.position.x,p.position.y,p.position.z);
            angle.push(p.rotation);
            size.push(p.size);
            opacity.push(p.alpha);
            life.push(p.life / p.lifeTime);
            direction.push(p.direction);

        }

    }

    t.raysGeometry.setAttribute('position',new t.THREE.Float32BufferAttribute(position,3));
    t.raysGeometry.setAttribute('angle',new t.THREE.Float32BufferAttribute(angle,1));
    t.raysGeometry.setAttribute('size',new t.THREE.Float32BufferAttribute(size,1));
    t.raysGeometry.setAttribute('opacity',new t.THREE.Float32BufferAttribute(opacity,1));
    t.raysGeometry.setAttribute('life',new t.THREE.Float32BufferAttribute(life,1));
    t.raysGeometry.setAttribute('direction',new t.THREE.Float32BufferAttribute(direction,1));

    t.raysGeometry.attributes.position.needsUpdate = true;
    t.raysGeometry.attributes.angle.needsUpdate = true;
    t.raysGeometry.attributes.size.needsUpdate = true;
    t.raysGeometry.attributes.opacity.needsUpdate = true;
    t.raysGeometry.attributes.life.needsUpdate = true;
    t.raysGeometry.attributes.direction.needsUpdate = true;

};

Sun.prototype.setRaysParticles2 = function(){

    const t = this;

    const position = [];
    const angle = [];
    const size = [];
    const opacity = [];
    const life = [];
    const direction = [];

    for(let i = 0; i < t.rays2Particles.length; i++){

        const p = t.rays2Particles[i];

        if(p.life > t.RAY_2_LIFE_TIME){

            t.rays2Particles.splice(i,1);
            i--;

        }else{

            p.position = p.position;
            p.life += 1;
            p.alpha = p.life / (p.lifeTime * 0.5);

            if(p.alpha >= 1){

                p.alpha = 2 - p.alpha;

            }

            position.push(p.position.x,p.position.y,p.position.z);
            angle.push(p.rotation);
            size.push(p.size);
            opacity.push(p.alpha);
            life.push(p.life / p.lifeTime);
            direction.push(p.direction);

        }

    }

    t.rays2Geometry.setAttribute('position',new t.THREE.Float32BufferAttribute(position,3));
    t.rays2Geometry.setAttribute('angle',new t.THREE.Float32BufferAttribute(angle,1));
    t.rays2Geometry.setAttribute('size',new t.THREE.Float32BufferAttribute(size,1));
    t.rays2Geometry.setAttribute('opacity',new t.THREE.Float32BufferAttribute(opacity,1));
    t.rays2Geometry.setAttribute('life',new t.THREE.Float32BufferAttribute(life,1));
    t.rays2Geometry.setAttribute('direction',new t.THREE.Float32BufferAttribute(direction,1));

    t.rays2Geometry.attributes.position.needsUpdate = true;
    t.rays2Geometry.attributes.angle.needsUpdate = true;
    t.rays2Geometry.attributes.size.needsUpdate = true;
    t.rays2Geometry.attributes.opacity.needsUpdate = true;
    t.rays2Geometry.attributes.life.needsUpdate = true;
    t.rays2Geometry.attributes.direction.needsUpdate = true;

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

    const r4 = new XMLHttpRequest();

    r4.open('get',`${t.asset}assets/shaders/sunVertexRays2.glsl`,false);
    r4.onreadystatechange = () => {
        if(r4.readyState === 4 && r4.status === 200){

            t.vertexShaderRays2 = r4.responseText;

        }
    };

    r4.send();


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

    const r4 = new XMLHttpRequest();

    r4.open('get',`${t.asset}assets/shaders/sunFragmentRays2.glsl`,false);
    r4.onreadystatechange = () => {
        if(r4.readyState === 4 && r4.status === 200){

            t.fragmentShaderRays2 = r4.responseText;

        }
    };

    r4.send();

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

Sun.prototype.getUniformsRays2 = function(){

    return {
        time : {value : 0},
        sRays : {value : this.rays2Texture},
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

        //Sun glow
        t.meshAlo.lookAt(camera.position);

        //Sun rays
        t.raysMaterial.uniforms.time.value = time;
        t.raysStep += 1;

        if(t.raysStep % t.RAYS_STEP === 0){

            t.addRaysParticles();

        }

        t.setRaysParticles();

        //Sun rays 2
        t.rays2Material.uniforms.time.value = time;
        t.rays2Step += 1;

        if(t.rays2Step % t.RAYS_STEP_2 === 0){

            t.addRaysParticles2();

        }

        t.setRaysParticles2();


    }

};

module.exports = Sun;
