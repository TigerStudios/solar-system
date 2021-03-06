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

    //Shaders
    this.vertexShaderRenderd = null;
    this.fragmentShaderRendered = null;

    this.map =  new this.THREE.TextureLoader().load(`${asset}assets/images/moon/moon_c.jpg`);

    this.renderedGeometry = null;
    this.renderedMaterial = null;

    this.setRendered(parameters);
    this.listeners();

    this.meshRendered = new this.THREE.Mesh(this.renderedGeometry,this.renderedMaterial);
    this.moonMesh = new parameters.THREE.Group();

    this.moonMesh.add(this.meshRendered);
    this.scene.add(this.moonMesh);

    this.moonMesh.visible = false;

}

Moon.prototype.listeners = function (){

    const t = this;

    _(window).on('LOCATION_CHANGE',(e) => {

        if(e.data.location === 'moon'){

            t.moonMesh.visible = true;

        }else{

            t.moonMesh.visible = false;

        }

    });

};

Moon.prototype.setRendered = function(parameters){

    const t = this;

    t.renderedGeometry = new parameters.THREE.SphereBufferGeometry(
        this.RADIUS / this.APP_SCALE,
        64,
        64
    );

    t.renderedMaterial = new parameters.THREE.MeshBasicMaterial({
        map : t.map,
        color : 0xffffff
    });

};

Moon.prototype.update = function(renderer,camera,time,elapsed){

    const t = this;

    if(t.meshRendered){

        t.meshRendered.rotation.y += Math.PI * 2 * (elapsed / t.CIRCONVOLUTION);

    }

};

module.exports = Moon;
