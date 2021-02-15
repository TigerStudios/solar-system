InfoController.prototype = Object.create(Object.prototype);
InfoController.prototype.constructor = InfoController;

function InfoController(){

    this.sunInfo = {

        name : 'SUN',
        diameter : '1.392.700 km',
        rotation : '1993 m/s',
        revolution : '27d 6h 36min',
        distance : '152.000.000 km from earth',

    };

    this.listeners();

};

InfoController.prototype.listeners = function (){

    const t = this;

    _(window).once('LOADER_GONE',() => t.showSunInfo());

};

InfoController.prototype.showSunInfo = function (){

    const t = this;

};

module.exports = InfoController;
