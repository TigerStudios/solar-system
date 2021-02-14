AudioController.prototype = Object.create(Object.prototype);
AudioController.prototype.constructor = AudioController;

function AudioController(){

    this.mainTrack = new Audio(`${asset}assets/sounds/alpha.mp3`);
    this.mainTrack.loop = true;

    this.listeners();

}

AudioController.prototype.listeners = function (){

    const t = this;

    _(window).once('LOADER_GONE',() => t.playMainTrack());

};

AudioController.prototype.playMainTrack = function (){

    const t = this;

    t.mainTrack.play();

};

module.exports = AudioController;
