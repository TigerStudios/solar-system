InfoController.prototype = Object.create(Object.prototype);
InfoController.prototype.constructor = InfoController;

function InfoController(){

    //Info
    this.sunInfo = {

        name : 'SUN',
        diameter : '1.392.700 km',
        rotation : '1993 meters/s',
        revolution : '27d 6h 36min',
        distance : '152.000.000 km from earth',

    };

    this.earthInfo = {

        name : 'EARTH',
        diameter : '12.742 km',
        rotation : '460 meters/s',
        revolution : '0d 23h 56min',
        distance : '152.000.000 km from sun',

    };

    this.moonInfo = {

        name : 'MOON',
        diameter : '3.473 km',
        rotation : '0,4 meters/s',
        revolution : '27d',
        distance : '384.400 km from earth',

    };

    //Elements
    this.box = _('#interface-box');
    this.flyButton = _('#fly-controls .button');
    this.name = _('#star-info .name');
    this.diameter = _('#star-info .diameter .target');
    this.rotation = _('#star-info .rotation .target');
    this.revolution = _('#star-info .revolution .target');
    this.distance = _('#star-info .distance .target');


    this.listeners();

};

InfoController.prototype.listeners = function (){

    const t = this;

    _(window).once('LOADER_GONE',() => {

        t.setInfo('sun');
        t.box.disabled(false).active(true);
        t.flyButton.disabled(false);

    });
    _(window).on('FLY_OVER',() => setTimeout(() => {

        t.box.disabled(false).active(true);
        t.flyButton.disabled(false);

    },1000));
    _(window).on('LOACTION_CHANGE', (e) => t.setInfo(e.data.location));

    t.flyButton.click(() => {

        _(window).emits('FLY');

        t.box.disabled(true).active(false);
        t.flyButton.disabled(true);

    });

};

InfoController.prototype.setInfo = function (star){

    const t = this;

    let info;

    switch(star){
        case 'sun' :
            info = this.sunInfo;
            break;
        case 'earth' :
            info = this.earthInfo;
            break;
        case 'moon' :
            info = this.moonInfo;
            break;
    }

    t.name.html(info.name);
    t.diameter.html(info.diameter);
    t.rotation.html(info.rotation);
    t.revolution.html(info.revolution);
    t.distance.html(info.distance);

};

module.exports = InfoController;
