InfoController.prototype = Object.create(Object.prototype);
InfoController.prototype.constructor = InfoController;

function InfoController(){

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
